// import axios from 'axios';
// import Notiflix from 'notiflix';

// export class ImgApi {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//     this.perPage = 40;
//     this.availableHits = 0;
//   }

//   async fetchImages() {
//     console.log(this);
//     const API_KEY = '38718917-264583084f4f4e3ea3ed33372';
//     const BASE_URL = 'https://pixabay.com/api/';
//     const options = {
//       params: {
//         key: API_KEY,
//         q: this.searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         lang: 'en',
//         page: this.page,
//         per_page: this.perPage,
//       },
//     };

//     const response = await axios.get(BASE_URL, options);
//     console.log(response);

//     if (response.status < 200 || response.status >= 300) {
//       throw new Error('Data failed to load.');
//     }

//     const data = response.data.hits;

//     this.wholeHits = response.data.totalHits;
//     this.availableHits = this.wholeHits - this.page * this.perPage;
//     this.page += 1;

//     return data;
//   }

//   get query() {
//     return this.searchQuery;
//   }
//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
//   resetNamberPage() {
//     this.page = 1;
//   }
//   bugReport(message) {
//     Notiflix.Notify.failure(message);
//   }
//   successReport(message) {
//     Notiflix.Notify.success(message);
//   }
// }
// 26.03.25
import axios from 'axios';
import CONSTANTS from './helpers/constants';

const ImageInstance = axios.create({
  baseURL: CONSTANTS.BASE_URL,
  params: {
    key: CONSTANTS.API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  },
});

async function fetchPhoto(searchQuery, page, perPage) {
  const response = await ImageInstance.get('/', {
    params: { q: searchQuery, page: page, per_page: perPage },
  });
  return response.data;
}

export default fetchPhoto;
