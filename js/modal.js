import { EscapeKey } from './util.js';
const commentTmp = document.querySelector('#modal-comment').content.querySelector('.social__comment');
const modalBigPicture = document.querySelector('.big-picture');

const postview = {
  image: modalBigPicture.querySelector('.big-picture__img img'),
  likes: modalBigPicture.querySelector('.likes-count'),
  comments: modalBigPicture.querySelector('.comments-count'),
  description: modalBigPicture.querySelector('.social__caption'),
  list: modalBigPicture.querySelector('.social__comments')
};

const commentCountField = document.querySelector('.social__comment-count');
const shownComments = document.querySelector('.shown-comments-count');
const refreshButton = document.querySelector('.comments-loader');

const COMMENT_STEP = 5;


/* Возможно ли без класса обойтись? Так и не придумал ничего*/


class Article {
  constructor(picture) {
    this.picture = picture;
    this.shownCommentsCount = 0;
  }

  clickAddMore() {
    this.shownCommentsCount += COMMENT_STEP;

    if (this.shownCommentsCount > this.picture.comments.length) {
      this.shownCommentsCount = this.picture.comments.length;
      refreshButton.classList.add('hidden');
    }

    this.refreshComments();
  }

  refreshComments() {
    postview.list.innerHTML = '';
    if (this.picture.comments.length === 0) {
      return;
    }
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.shownCommentsCount; i++) {
      const newComment = commentTmp.cloneNode(true);
      const {avatar, name, message} = this.picture.comments[i];
      newComment.querySelector('.social__picture').src = avatar;
      newComment.querySelector('.social__picture').alt = name;
      newComment.querySelector('.social__text').textContent = message;
      fragment.appendChild(newComment);
    }
    postview.list.appendChild(fragment);
    shownComments.textContent = this.shownCommentsCount;
    commentCountField.classList.remove('hidden');
    if (this.shownCommentsCount < this.picture.comments.length) {
      refreshButton.classList.remove('hidden');
    }
  }

  show() {
    postview.image.src = this.picture.url;
    postview.likes.textContent = this.picture.likes;
    postview.comments.textContent = String(this.picture.comments.length);
    postview.description.textContent = this.picture.description;

    if (this.picture.comments.length !== 0) {
      if (COMMENT_STEP > this.picture.comments.length) {
        this.shownCommentsCount = this.picture.comments.length;
      } else {
        this.shownCommentsCount = COMMENT_STEP;
      }
    }

    this.refreshComments();
  }
}

const picturesCache = {};

const onDocumentKeydown = (evt) => {
  if (EscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};


const showBackDrop = () => {
  modalBigPicture.classList.remove('hidden'); /* убирает класс hidden */
  document.body.classList.add('modal-open');
  commentCountField.classList.add('hidden');
  refreshButton.classList.add('hidden');
  document.addEventListener('keydown', onDocumentKeydown);
};


function showModal(picture) {
  let pictureModal = picturesCache[picture.id];

  showBackDrop();

  if (pictureModal) {
    pictureModal.show();
    return;
  }

  pictureModal = new Article(picture);
  pictureModal.show();

  picturesCache[picture.id] = pictureModal;

  refreshButton.addEventListener('click', () => pictureModal.clickAddMore());
}

function closeModal() {
  modalBigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

modalBigPicture.addEventListener('click', (evt) => {
  if (evt.target.matches('.big-picture__cancel')) {
    closeModal();
  }
});

export {showModal};
