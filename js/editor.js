import '/vendor/pristine/pristine.min.js';
import { isEscapeKey } from './util.js';
import { isHashtagValid, isRepeatedHashTags, isHashTagLimitExceeded } from './validators.js';

class Editor {
  constructor (form) {
    this.form = form;
    this.backDrop = form.querySelector('.img-upload__overlay');
    this.closeButton = form.querySelector('.img-upload__cancel');
    this.uploadInput = form.querySelector('.img-upload__input');
    this.hashTagFiled = form.querySelector('.text__hashtags');
    this.textareaField = form.querySelector('.text__description');
    this.pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextTag: 'div',
    });
  }

  init () {
    this.uploadInput.addEventListener('change', (evt) => {
      this.toggle(true);
      this.showImage(evt);
    });

    this.closeButton.addEventListener('click', () => this.toggle(false));

    this.pristine.addValidator(
      this.hashTagFiled,
      isHashtagValid,
      'хэш-тег должен начинаться с символа #, ' +
      'хеш-тег не может состоять только из одной решётки, ' +
      'строка после решётки должна состоять из букв и чисел, ' +
      'максимальная длина одного хэш-тега 20 символов, включая решётку');

    this.pristine.addValidator(
      this.hashTagFiled,
      isRepeatedHashTags,
      'нельзя использовать один и тот же хэш-тег');

    this.pristine.addValidator(
      this.hashTagFiled,
      isHashTagLimitExceeded,
      'нельзя добавить более пяти хэш-тегов');

    this.form.addEventListener('submit', (evt) => this.onSubmit(evt));
  }

  onDocumentKeydown (evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      if (evt.target.closest('.img-upload__field-wrapper')) {
        return;
      }
      this.closeBackDrop();
    }
  }

  showBackdrop () {
    this.backDrop.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  closeBackDrop() {
    this.backDrop.classList.add('hidden');
    document.body.classList.remove('modal-open');
    this.uploadInput.value = '';
    this.hashTagFiled.value = '';
    this.textareaField.value = '';
    /* сбрасывание значсений */
  }

  onSubmit(evt) {
    evt.preventDefault();
    const valid = this.pristine.validate();
    window.console.log('!!!', valid);
  }

  toggle (state) {
    if (state) {
      this.showBackdrop();
      document.addEventListener('keydown', (evt) => this.onDocumentKeydown(evt));
    } else {
      this.closeBackDrop();
      document.removeEventListener('keydown', (evt) => this.onDocumentKeydown(evt));
    }
  }

  showImage (image) {
    this.image = image;
  }
}

const editor = new Editor(document.querySelector('.img-upload__form'));

editor.init();
