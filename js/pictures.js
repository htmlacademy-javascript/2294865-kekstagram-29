const tmp = document.querySelector('#picture').content.querySelector('.picture');
const pictureBlock = document.querySelector('.pictures');

const createPicture = ({id, url, description, comments, likes}) => {
  const pictureTmp = tmp.cloneNode(true);
  pictureTmp.dataset.pictureId = id || '';
  pictureTmp.querySelector('.picture__img').src = url || '';
  pictureTmp.querySelector('.picture__img').alt = description || '';
  pictureTmp.querySelector('.picture__comments').textContent = comments.length || '';
  pictureTmp.querySelector('.picture__likes').textContent = likes || '';
  return pictureTmp;
};

const renderPicture = (pictures) => {
  const fragment = document.createDocumentFragment();
  pictures.forEach((picture) => {
    fragment.appendChild(createPicture(picture));
  });
  pictureBlock.appendChild(fragment);
};

export {renderPicture};
