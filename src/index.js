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
    renderImages(images);
    loadMoreBtn.style.display = 'block';
    initializeLightbox();

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
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
    handleLoadMoreButton(images.length, loadMoreBtn);
  });

  function renderImages(images) {
    const cards = [];

    images.forEach((image) => {
      const card = createImageCard(image);
      cards.push(card);
    });

    gallery.append(...cards);
  }

  function initializeLightbox() {
    if (lightbox) {
      lightbox.destroy();
    }

    lightbox = new SimpleLightbox('.gallery a');
  }

  function createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const link = document.createElement('a');
    link.href = image.largeImageURL;
    link.classList.add('img-link');

    const img = document.createElement('img');
    img.classList.add('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(info);

    return card;
  }

  function handleLoadMoreButton(imagesCount, loadMoreBtn) {
    if (imagesCount < 40) {
      loadMoreBtn.style.display = 'none';
    } else {
      Notiflix.Notify.info('You have reached the end of the page.');
      loadMoreBtn.style.display = 'block';
    }
  }
});
