import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import imageCardTpl from './template/imageCardTpl.hbs';
import ImageApiService from './js/image-service';
import LoadMoreBtn from './js/load-more-btn';
import getRefs from './js/refs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const refs = getRefs();
 
refs.imageForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', loadImage);

function lightbox() {
 let gallery = new SimpleLightbox('.photo-card a', {
   captionsData: "alt",
  captionDelay: 250,
});
gallery.on('show.simplelightbox', function () {});
}

async function onSearch(event) {
  event.preventDefault();
  imageApiService.query = event.target.elements.searchQuery.value;
  if (imageApiService.query === "" && !imageApiService.query) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  };

  loadMoreBtn.show();
  imageBaseClear();
  imageApiService.resetPage();
  loadImage()

};


async function loadImage() {
  loadMoreBtn.disable();
  try {
    await imageApiService.fetchArticles().then(imageData => {
      imageBaseMarkup(imageData);
      loadMoreBtn.enable();
      lightbox();
    });
  }  catch (error) {
      console.log(error);
      Notify.error('Please enter a valid request.');
  };
};

function imageBaseMarkup(image) {
  refs.galeryElement.insertAdjacentHTML('beforeend', imageCardTpl(image));
  
};

function imageBaseClear() {
  refs.galeryElement.innerHTML = '';
};






