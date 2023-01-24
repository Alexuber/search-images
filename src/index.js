import './saas/index.scss';
import './js/btn-up.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Pixabay from './js/PixabayApiService';

const lihgtBoxOptions = { captionDelay: 250, scrollZoom: false };
let simpleLightbox;
const pixabay = new Pixabay();

const searchFormEl = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-txt');
const loadMoreBtnEl = document.querySelector('.load-more');
const startBlockEl = document.querySelector('.start');

pixabay.hide();

searchFormEl.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();

  const userQuery = searchInput.value.trim();

  if (userQuery === '') {
    pixabay.notifyEmptyQuery();
  } else {
    startBlockEl.style.display = 'none';

    pixabay.show();
    pixabay.enable();
    pixabay.q = searchInput.value;
    pixabay.resetPage();

    pixabay
      .getImages()
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          pixabay.notifyNoData();
          startBlockEl.style.display = 'block';
        } else {
          pixabay.renderMarkup(hits);
          simpleLightbox = new SimpleLightbox('.gallery a', lihgtBoxOptions);
          pixabay.notifySucces(totalHits);
        }
      })
      .catch(console.log);

    pixabay.refreshMarkup();
  }
}

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function handleLoadMoreBtnClick(e) {
  pixabay.disable();
  pixabay
    .getImages()
    .then(({ hits, totalHits }) => {
      if (pixabay.page - 1 > Math.ceil(totalHits / pixabay.per_page)) {
        pixabay.hide();
        pixabay.notifyEndOfSearchResults();
      } else {
        pixabay.renderMarkup(hits);
        simpleLightbox.refresh();

        pixabay.slowScroll();
        pixabay.enable();
      }
    })
    .catch(() => {
      pixabay.enable();
    });
}
