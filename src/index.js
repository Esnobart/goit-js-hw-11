import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages, totalImages } from './api';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let page = 1;
  let lightbox;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = event.target.elements.searchQuery.value;

    if (query.trim() === '') {
      Notiflix.Notify.failure('Please enter a search query.');
      return;
    }

    gallery.innerHTML = '';
    page = 1;

    const images = await searchImages(query, page);
    if (images.totalHits > 40) {
      loadMoreBtn.style.display = "block";
    }
    renderImages(images);
    initializeLightbox();

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.style.display = "none";
      return;
    }

    Notiflix.Notify.info(`Total images found: ${totalImages}`);
  });

  loadMoreBtn.addEventListener('click', async () => {
    const query = form.elements.searchQuery.value;
    page++;
    const images = await searchImages(query, page);
    renderImages(images);
    initializeLightbox();
    
    const lastPage = Math.ceil(images.totalHits / 40);

    if (page === lastPage) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  });

  function renderImages(images) {
    const cardsHTML = images.map(createImageCard).join('');
    gallery.insertAdjacentHTML('beforeend', cardsHTML);
  }

  function initializeLightbox() {
    if (lightbox) {
      lightbox.destroy();
    }

    lightbox = new SimpleLightbox('.gallery a');
  }

  const createImageCard = (image) => `
    <div class="photo-card">
      <a href="${image.largeImageURL}" class="img-link">
        <img src="${image.webformatURL}" alt="${image.tags}" class="img" loading="lazy">
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `;
});
