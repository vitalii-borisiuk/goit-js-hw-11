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
let hitsLength = 0;
 
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

  console.log(hitsLength);
  event.preventDefault();
  imageApiService.query = event.target.elements.searchQuery.value;
  if (imageApiService.query === "") {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  };
  loadMoreBtn.show();
  imageBaseClear();
  imageApiService.resetPage();
  loadImage()
    hitsLength = 0;
};


async function loadImage() {
  loadMoreBtn.disable();

  try {
    await imageApiService.fetchArticles().then(imageData => {
      if (imageData.totalHits === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        loadMoreBtn.hide();
        return;
      }
      hitsLength = hitsLength + imageData.hits.length;
      if (hitsLength >= imageData.totalHits) {
        loadMoreBtn.hide();
        Notify.info("We're sorry, but you've reached the end of search results.");
      }      
      Notify.success(`Hooray! We found ${imageData.totalHits} images.`);
      Notify.success(`Hooray! We found ${hitsLength} images on this page.`);
      console.log(imageData.totalHits);
      imageBaseMarkup(imageData.hits);

      loadMoreBtn.enable();
      lightbox();
    });
  }  catch (error) {
    console.log(error);

    refs.galeryElement.innerHTML = '';
      Notify.failure('Please enter a valid request.');
  };

};

function imageBaseMarkup(image) {
  refs.galeryElement.insertAdjacentHTML('beforeend', imageCardTpl(image));
};

function imageBaseClear() {
  refs.galeryElement.innerHTML = '';
};






