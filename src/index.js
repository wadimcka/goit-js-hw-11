import { ImgApi } from './img-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

const pixaImgApi = new ImgApi();

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', onloadMoreBtn);

function onFormSubmit(event) {
  event.preventDefault();
  pixaImgApi.query = event.currentTarget.elements.searchQuery.value.trim();

  if (!pixaImgApi.query) {
    pixaImgApi.bugReport(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  pixaImgApi.resetNamberPage();
  cardCleaner();

  try {
    pixaImgApi
      .fetchImages()
      .then(data => {
        if (!data.length) {
          pixaImgApi.bugReport(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          refs.loadMoreBtnEl.classList.remove('visible');
          return;
        }
        pixaImgApi.successReport(
          `Hooray! We found ${pixaImgApi.wholeHits} images.`
        );
        cardRender(data);
        refs.loadMoreBtnEl.classList.add('visible');
      })
      .catch(error => {
        console.log(error.name, error.message);
      });
  } catch (error) {
    console.log(error.name, error.message);
  }
}

async function cardRender(data) {
  const imgCard = await data
    .map(hit => {
      const {
        total,
        webformatURL,
        largeImageURL,
        id,
        likes,
        views,
        comments,
        downloads,
      } = hit;

      return `<div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${id}" loading="lazy" />  
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b> 
    </p>
  </div>
</div>
  `;
    })
    .join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', imgCard);
  const lightbox = new SimpleLightbox('.gallery a', {});
  lightbox.refresh();
}

async function onloadMoreBtn(event) {
  try {
    if (pixaImgApi.availableHits <= pixaImgApi.perPage) {
      refs.loadMoreBtnEl.classList.remove('visible');
      pixaImgApi.bugReport(
        "We're sorry, but you've reached the end of search results."
      );
    }
    const loadedData = await pixaImgApi.fetchImages();
    console.log(pixaImgApi.availableHits);
    console.log(pixaImgApi.perPage);

    if (loadedData.length > 0) {
      cardRender(loadedData);
    }
  } catch (error) {
    console.log(error.name, error.message);
  }
}

function cardCleaner() {
  refs.galleryEl.innerHTML = '';
}
