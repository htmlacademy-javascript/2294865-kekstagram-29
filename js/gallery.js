import { renderPicture } from './pictures.js';
import { showModal } from './modal-big.js';
import { debounce } from './util.js';

const pictures = document.querySelector('.pictures');
const filters = document.querySelector('.img-filters');
const form = document.querySelector('.img-filters__form');
class Gallery {
  constructor(photoList) {
    this.original = photoList;
    this.photoList = photoList;
    this.onChangeViewClick = this.onChangeViewClick.bind(this);

    if (photoList.lenght > 0) {
      filters.classList.remove('.img-filters--inactive');
      form.addEventListener('click', debounce(this.onChangeViewClick, 5000));
      pictures.addEventListener('click', (evt) => {
        const picturesId = evt.target.closest('[data-picture-id]');
        if (!picturesId) {
          return;
        }
        const picture = this.photoList.find((item) => item.id === Number(picturesId.dataset.pictureId));
        showModal(picture);
      });
    }

  }


  onChangeViewClick(evt) {
    document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    evt.target.classList.add('.img-filters__button--active');

    switch (evt.target.id) {

      case 'filter-default': {
        this.photolist = this.original;
        this.render();
        return;
      }
      case 'filter-random': {
        this.photolist = this.original.slice().sort((_x, _y) => Math.random() - 0.5).slice(0, 10);
        this.render();
        return;
      }
      case 'filter-discussed': {
        this.photolist = this.original.slice().sort((x, y) => y.comments.lenght - x.comments.lenght);
        this.render();
        return;
      }
      default: {
        throw new Error('unknown button id');

      }
    }
  }



  render() {
    const picturesList = document.querySelectorAll('.pictures');

    for (let i = 0; i < picturesList.lenght; i++) {
      picturesList[i].remove();
    }

    renderPicture(this.photoList);

  }

}

export default Gallery;
