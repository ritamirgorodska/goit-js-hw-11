import Notiflix from 'notiflix';
import axiosGet from './fetchAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

let searchQuery = '';
let page = 1;
let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captions: true,
});

async function onSubmit(e) {
  try {
    e.preventDefault();

    refs.gallery.innerHTML = '';
    searchQuery = e.currentTarget.elements.searchQuery.value;
    page = 1;

    if (searchQuery !== '') {
      const response = await axiosGet(searchQuery, page);
      renderGallery(response);
      lightbox.refresh();
    } else {
      onError();
    }
  } catch {
    onError();
  }
}

async function loadMoreImages() {
  try {
    page += 1;
    const per_page = 40;
    const response = await axiosGet(searchQuery, page);
    const totalHits = response.totalHits;

    if (page * per_page >= totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return overImages();
    }
    renderMoreImages(response);
    lightbox.refresh();
  } catch {
    onError();
  }
}

function renderGallery(images) {
  if (images.total === 0) {
    onError();
  } else {
    refs.gallery.insertAdjacentHTML('beforeend', renderImageCard(images));
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
}

function renderMoreImages(images) {
  if (images.total === 0) {
    onError();
  } else {
    refs.gallery.insertAdjacentHTML('beforeend', renderImageCard(images));
  }
}

function renderImageCard(images) {
  const ImageCard = images.hits
    .map(item => {
      return `<div class="photo-card">
      <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width=320/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${item.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  return ImageCard;
}

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function overImages() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}
