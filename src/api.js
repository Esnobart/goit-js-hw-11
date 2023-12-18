import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '41297883-88ea64e1445e53f74e3df359e';
const perPage = 40;
export let totalImages = 0; 

export async function searchImages(query, currentPage) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return [];
    }

    totalImages = data.totalHits;
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export function handleLoadMoreButton(imagesCount, loadMoreBtn) {
  if (imagesCount < perPage || totalImages === imagesCount) {
    loadMoreBtn.style.display = 'none';
    if (totalImages > 0) {
      Notiflix.Notify.info(`Total images found: ${totalImages}`);
    } else {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  } else {
    loadMoreBtn.style.display = 'block';
    Notiflix.Notify.info(`Showing ${imagesCount} out of ${totalImages} images`);
  }
}
