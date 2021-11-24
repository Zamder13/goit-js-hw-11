import Notiflix from 'notiflix';
// import fetch from './js/fetch';
import axios from 'axios';

const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input[name="searchQuery"]'),
  div: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);

// ==================================загрузка изображений

axios.defaults.baseURL = 'https://pixabay.com/api/';

const KEY = '24441832-e1f7ed32578d6107b72c2a05f';

const getImages = async something => {
  const response = await axios.get(
    `?per_page=40&page=1&key=${KEY}&q=${something}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  console.log(response.data);
  return response.data;
};

//================================== отпраувка формі
function onFormSubmit(event) {
  event.preventDefault();
  const input = event.currentTarget.elements.searchQuery.value;
  getImages(input)
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
