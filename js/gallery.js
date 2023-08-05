import {renderPicture} from './pictures.js';
import {showModal} from './modal-big.js';

const pictures = document.querySelector('.pictures');
//const filters = document.querySelector('.img-filters');

class Gallary {
  constructor(photoList){
    this.photoList = photoList;
  }

  //if (photoList.length > 0) {
  //filters.classList.remove('img-filters--inactive')
  // }


  render(photoList) {
    renderPicture(photoList);

    pictures.addEventListener('click', (evt) => {
      const picturesId = evt.target.closest('[data-picture-id]');
      if (!picturesId) {
        return ;
      }
      const picture = photoList.find((item) => item.id === Number(picturesId.dataset.pictureId));
      showModal(picture);
    });
  }

}

export default Gallary;
