import Notiflix from 'notiflix';
import GetImagesApi from './js/fetch';
import axios from 'axios';

// let input = '';

const getImagesApi = new GetImagesApi();

const refs = {
  form: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  div: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// ==================================загрузка изображений

// axios.defaults.baseURL = 'https://pixabay.com/api/';

// const KEY = '24441832-e1f7ed32578d6107b72c2a05f';

// async function getImages(something) {
//   const response = await axios.get(
//     `?per_page=40&page=1&key=${KEY}&q=${something}&image_type=photo&orientation=horizontal&safesearch=true`
//   );
//   console.log(response.data);
//   return response.data;
// }

//================================== отпраувка формі
function onFormSubmit(event) {
  event.preventDefault();

  clearContainer();

  getImagesApi.input = event.currentTarget.elements.searchQuery.value;

  getImagesApi.resetPage();

  getImagesApi
    .getImages()
    .then(data => {
      renderImage(data);

      console.log(data);
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  getImagesApi
    .getImages()
    .then(data => {
      renderImage(data);
    })
    .catch(error => console.log(error));
}

function renderImage({ hits }) {
  let markup = hits
    .map(
      ({
        webformatURL,
        largeImageUR,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  console.log(markup);

  refs.div.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  refs.div.innerHTML = '';
}
