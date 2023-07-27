import { EscapeKey } from './util.js';
const commentTmp = document.querySelector('#modal-comment').content.querySelector('.social__comment');

const modal = document.querySelector('.big-picture');
const modalContent = {
  Image: modal.querySelector('.big-picture__img img'),
  Likes: modal.querySelector('.likes-count'),
  Comments: modal.querySelector('.comments-count'),
  Description: modal.querySelector('.social__caption'),
};

const modalList = modal.querySelector('.social__comments');

const commentCount = document.querySelector('.social__comment-count');
const commentLoader = document.querySelector('.comments-loader');

const createComment = ({url, likes, description,comments}) => {
  modalContent.Image.src = url;
  modalContent.Likes.textContent = likes;
  modalContent.Comments.textContent = comments.length;
  modalContent.Description.textContent = description;
  const fragment = document.createDocumentFragment();
  comments.forEach(({avatar, message, name}) => {
    const newComment = commentTmp.cloneNode(true);
    newComment.querySelector('.social__picture').src = avatar;
    newComment.querySelector('.social__picture').alt = name;
    newComment.querySelector('.social__text').textContent = message;
    fragment.appendChild(newComment);
  });
  modalList.innerHTML = '';
  modalList.appendChild(fragment);
};

const onDocumentKeydown = (evt) => {
  if (EscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

function showModal(picture) {
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  commentCount.classList.add('hidden');
  commentLoader.classList.add('hidden');
  document.addEventListener('keydown', onDocumentKeydown);
  createComment(picture);
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  commentCount.classList.remove('hidden');
  commentLoader.classList.remove('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
}

modal.addEventListener('click', (evt) => {
  if (evt.target.matches('.big-picture__cancel')) {
    closeModal();
  }
});

export {showModal};
