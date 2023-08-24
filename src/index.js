import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './js/fetchImages';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endText = document.querySelector('.end-text')
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

let pageNumber = 1;
let currentHits = 0;
let searchQuery = '';


loadMoreBtn.style.display = 'none';
endText.style.display = 'none';


function renderImageList(images) {
    console.log(images, 'images');
    const markup = images
      .map(image => {
        console.log('img', image);
        return `<div class="photo-card">
         <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
          <div class="info">
             <p class="info-item">
      <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
  </p>
              <p class="info-item">
                  <b>Views</b> <span class="info-item-api">${image.views}</span>
              </p>
              <p class="info-item">
                  <b>Comments</b> <span class="info-item-api">${image.comments}</span>
              </p>
              <p class="info-item">
                  <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
              </p>
          </div>
      </div>`;
      })
      .join('');
    gallery.innerHTML += markup;
  }

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.searchQuery.value.trim();
    pageNumber = 1;
  
  
    if (!searchQuery) {
      // message('Please write correct data!');
      // return message('Please write correct data!');
      Notiflix.Notify.failure('Please write correct data!');
      return;
    }
   
    const response = await fetchImages(searchQuery, pageNumber);
    currentHits = response.hits.length;
  
    if (pageNumber >= Math.ceil(response.totalHits / 40)) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }

    try {
      if (response.total === 0) {
        // message('Please write correct data!');
        // return message('Please write correct data!');
        Notiflix.Notify.failure('Please write correct data!');
        return;
      }
      currentHits += response.hits.length;
      if (currentHits === response.totalHits || currentHits < 40) {
       endText.textContent =
          'Were sorry, but you ve reached the end of search results.';
          loadMoreBtn.style.display = 'none';
          endText.style.display = 'block';
        return;
      }
      if (response.totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
        gallery.innerHTML = '';
        renderImageList (response.hits);
        gallerySimpleLightbox.refresh();
      }
  
      if (response.totalHits === 0) {
        gallery.innerHTML = '';
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);
  
  async function onClickLoadMoreBtn() {
    pageNumber ++;
    const response = await fetchImages(searchQuery, pageNumber);
    renderImageList(response.hits);
    gallerySimpleLightbox.refresh();
    currentHits += response.hits.length;
  
    if (currentHits === response.totalHits) {
      loadMoreBtn.style.display = 'none';
      endText.style.display = 'block';
    } 

    if (pageNumber >= Math.ceil(response.totalHits / 40)) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }
  
  