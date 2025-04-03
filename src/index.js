// import { ImgApi } from './img-api';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const refs = {
//   formEl: document.querySelector('#search-form'),
//   galleryEl: document.querySelector('.gallery'),
//   loadMoreBtnEl: document.querySelector('.load-more'),
// };

// const pixaImgApi = new ImgApi();

// refs.formEl.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtnEl.addEventListener('click', onloadMoreBtn);

// function onFormSubmit(event) {
//   event.preventDefault();
//   pixaImgApi.query = event.currentTarget.elements.searchQuery.value.trim();

//   if (!pixaImgApi.query) {
//     pixaImgApi.bugReport(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     return;
//   }

//   pixaImgApi.resetNamberPage();
//   cardCleaner();

//   try {
//     pixaImgApi
//       .fetchImages()
//       .then(data => {
//         if (!data.length) {
//           pixaImgApi.bugReport(
//             'Sorry, there are no images matching your search query. Please try again.'
//           );
//           refs.loadMoreBtnEl.classList.remove('visible');
//           return;
//         }
//         pixaImgApi.successReport(
//           `Hooray! We found ${pixaImgApi.wholeHits} images.`
//         );
//         cardRender(data);
//         refs.loadMoreBtnEl.classList.add('visible');
//       })
//       .catch(error => {
//         console.log(error.name, error.message);
//       });
//   } catch (error) {
//     console.log(error.name, error.message);
//   }
// }

// async function cardRender(data) {
//   const imgCard = await data
//     .map(hit => {
//       const {
//         total,
//         webformatURL,
//         largeImageURL,
//         id,
//         likes,
//         views,
//         comments,
//         downloads,
//       } = hit;

//       return `<div class="photo-card">
//       <a class="gallery__link" href="${largeImageURL}">
//   <img src="${webformatURL}" alt="${id}" loading="lazy" />
//   </a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads ${downloads}</b>
//     </p>
//   </div>
// </div>
//   `;
//     })
//     .join('');
//   refs.galleryEl.insertAdjacentHTML('beforeend', imgCard);
//   const lightbox = new SimpleLightbox('.gallery a', {});
//   lightbox.refresh();
// }

// async function onloadMoreBtn(event) {
//   try {
//     if (pixaImgApi.availableHits <= pixaImgApi.perPage) {
//       refs.loadMoreBtnEl.classList.remove('visible');
//       pixaImgApi.bugReport(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     const loadedData = await pixaImgApi.fetchImages();
//     console.log(pixaImgApi.availableHits);
//     console.log(pixaImgApi.perPage);

//     if (loadedData.length > 0) {
//       cardRender(loadedData);
//     }
//   } catch (error) {
//     console.log(error.name, error.message);
//   }
// }

// function cardCleaner() {
//   refs.galleryEl.innerHTML = '';
// }

// 26.03.25

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import fetchPhoto from './js/pixabay-api';
import simpleLightbox from './js/helpers/simpleLightbox';
import renderGalleryCartList from './js/markup';
import smoothScroll from './js/helpers/scroll';
import { refs } from './js/refs';

let searchQuery = '';
let page = 1;
const perPage = 40;

refs.formEl.addEventListener('submit', onFormSubmit);

const observer = new IntersectionObserver(loadMoreImg, {
  root: null,
  rootMargin: '300px',
});

async function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = refs.inputEl.value.trim();
  page = 1;

  if (!searchQuery) {
    return Notify.warning('You entered an invalid value. Please try again!');
  }

  try {
    refs.galleryEl.innerHTML = '';
    const { hits, totalHits } = await fetchPhoto(searchQuery, page, perPage);

    if (!hits || hits.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (page === 1 && totalHits > perPage) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      observer.observe(refs.observerEl);
    }
    renderGalleryCartList(hits);
    simpleLightbox.refresh();
  } catch (error) {
    console.log('error', error);
    Notify.failure(error.message);
  } finally {
    refs.formEl.reset();
  }
}

async function loadMoreImg(entries, observer) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      page += 1;

      try {
        const { hits, totalHits } = await fetchPhoto(
          searchQuery,
          page,
          perPage
        );

        if (hits && hits.length > 0) {
          renderGalleryCartList(hits);
          simpleLightbox.refresh();
          smoothScroll();
        }

        if (page * perPage >= totalHits && page !== 1) {
          observer.unobserve(refs.observerEl);
          Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } catch (error) {
        Notify.failure(error.message);
      }
    }
  }
}

async function loadMoreImg(entries, observer) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      page += 1;
      try {
        const { hits, totalHits } = await fetchPhoto(
          searchQuery,
          page,
          perPage
        );

        if (hits && hits.length > 0) {
          renderGalleryCartList(hits);
          simpleLightbox.refresh();
          smoothScroll();
        }

        if (page * perPage >= totalHits) {
          observer.unobserve(refs.observerEl);
          Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } catch (error) {
        Notify.failure(error.message);
      }
    }
  }
}
