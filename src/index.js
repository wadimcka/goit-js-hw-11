import axios from 'axios';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};
console.log(refs.loadMoreBtnEl);

const API_KEY = '38718917-264583084f4f4e3ea3ed33372';
const BASE_URL = 'https://pixabay.com/api/';
const options = {
  params: {
    key: API_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', onloadMoreBtn);

function onFormSubmit(event) {
  event.preventDefault();
  options.q = event.currentTarget.elements.searchQuery.value;
  console.log(options.q);
}

function onloadMoreBtn(event) {}

// async function fetchImages(query) {
//   try {
//     const response = await axios.get(BASE_URL, options);
//     const data = response.data;
//     return data.hits;
//   } catch (error) {
//     throw error;
//   }
// }

// async function main() {
//   try {
//     const images = await fetchImages('cat');
//     console.log(images);
//   } catch (error) {
//     console.error('Error fetching images:', error);
//   }
// }

// main();

// trim
