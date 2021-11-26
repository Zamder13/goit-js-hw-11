import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import GetImagesApi from './js/getImagesAPI';
import { throttle } from 'lodash';
import LoadMoreBtn from './js/load-more-btn';

const getImagesApi = new GetImagesApi();

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
// console.log(loadMoreBtn);

const refs = {
  form: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  div: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
// ============================================================================================================
(() => {
  window.addEventListener('scroll', throttle(checkPosition, 400));
  window.addEventListener('resize', throttle(checkPosition, 400));
})();

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  const scrolled = window.scrollY;

  const threshold = height - screenHeight / 4;

  const position = scrolled + screenHeight;

  if (position >= threshold) {
    getImagesApi
      .getImages()
      .then(data => {
        renderImage(data);
      })
      .catch(error => console.log(error));
  }
}
// ==================================================================================================================================

//================================== отпраувка формі
function onFormSubmit(event) {
  event.preventDefault();

  getImagesApi.input = event.currentTarget.elements.searchQuery.value.trim();
  if (getImagesApi.input === '') {
    return;
  }

  // loadMoreBtn.show();
  // loadMoreBtn.disable();
  getImagesApi.resetPage();
  getImagesApi
    .getImages()
    .then(data => {
      clearContainer();

      renderImage(data);
      // loadMoreBtn.enable();

      console.log(data);
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      } else if (data.totalHits !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
      }
    })
    .catch(error => console.log(error));
}

// function onLoadMore() {
//   loadMoreBtn.disable();

//   getImagesApi
//     .getImages()
//     .then(data => {
//       renderImage(data);
//       loadMoreBtn.enable();
//     })
//     .catch(error => console.log(error));
// }

function renderImage({ hits }) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a href="${largeImageURL}" class="link">
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" />
  <div class="info">
    <p class="info-item">
      <b>likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>views: ${views}</b>
    </p>
    <p class="info-item">
      <b>comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>downloads: ${downloads}</b>
    </p>
  </div>
</div>
</a>`
    )
    .join('');

  refs.div.insertAdjacentHTML('beforeend', markup);
  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: '250',
    focus: false,
  });
  console.log(gallery);
  gallery.refresh();
}

function clearContainer() {
  refs.div.innerHTML = '';
}
