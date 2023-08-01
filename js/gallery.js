import {renderPicture} from './pictures.js';
import {showModal} from './modal-big.js';

const pictures = document.querySelector('.pictures');

function renderGallery(photoList) {
  renderPicture(photoList);
  pictures.addEventListener('click', (evt) => {
    const picturesId = evt.target.closest('[data-picture-id]');
    if (!picturesId) {
      return '';
    }
    const picture = photoList.find((item) => item.id === Number(picturesId.dataset.pictureId));
    showModal(picture);
  });
}

export {renderGallery};
