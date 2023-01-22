import './saas/index.scss';
import './js/btn-up.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Pixabay from './js/PixabayApiService';

const lihgtBoxOptions = { captionDelay: 250, scrollZoom: false };
let simpleLightbox;
const pixabay = new Pixabay();

const searchFormEl = document.querySelector('.search-form');
const searchBtnEl = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-txt');
const loadMoreBtnEl = document.querySelector('.load-more');

pixabay.hide();

searchFormEl.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  pixabay.disable();
  pixabay.enable();
  const userQuery = searchInput.value.trim();

  if (userQuery === '') {
    pixabay.notifyEmptyQuery();
  } else {
    pixabay.q = searchInput.value; // не виходить дістатися через e.target ???
    pixabay.resetPage();

    pixabay.getImages().then(images => {
      if (images.length === 0) {
        pixabay.notifyNoData();
      } else {
        pixabay.renderMarkup(images);
        simpleLightbox = new SimpleLightbox('.gallery a', lihgtBoxOptions);
        pixabay.notifySucces(images.length);
      }
    });

    pixabay.refreshMarkup();
    pixabay.show();
  }
}

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function handleLoadMoreBtnClick(e) {
  pixabay.disable();
  pixabay.getImages().then(images => {
    pixabay.renderMarkup(images);
    simpleLightbox.refresh();
    pixabay.enable();
    pixabay.notifySucces(images.length);
  });
}

// fix focus-border in gallery-slider
// hide and show load-more btn
// make spinner on load-more btn
// fix blue bg on load-more btn
// Сделать плавную прокрутку страницы после запроса и отрисовки
// make infinite-scroll - 2nd variant
// add alert with end of search on last page
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять отображается.
