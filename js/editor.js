import '/vendor/pristine/pristine.min.js';
import '/vendor/nouislider/nouislider.js';
import { isHashtagValid, isRepeatedHashTags, isHashTagLimitExceeded } from './validation.js';
import { FILTERS } from './filtersdata.js';
import { sendData } from './api-fetch.js';
import { messageModal } from './modal-message.js';
import { modalManager } from './modal-manager.js';
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

class Editor {
  constructor(form) {
    this.form = form;
    this.backDrop = form.querySelector('.img-upload__overlay');
    this.closeButton = form.querySelector('.img-upload__cancel');
    this.uploadInput = form.querySelector('.img-upload__input');
    this.submitButton = form.querySelector('.img-upload__submit');
    this.scaleBox = form.querySelector('.img-upload__scale'); // Поиск поля редактирования масштаба картинки
    this.scaleInput = form.querySelector('.scale__control--value');
    this.scaleDecreaseButton = form.querySelector('.scale__control--smaller');
    this.scaleIncreaseButton = form.querySelector('.scale__control--bigger');
    this.uploadedImage = form.querySelector('.img-upload__preview img');
    this.sliderContainer = form.querySelector('.img-upload__effect-level'); //Slide
    this.effectDataField = form.querySelector('.effect-level__value');
    this.sliderElement = form.querySelector('.effect-level__slider');
    this.effectsList = form.querySelector('.effects__list');
    this.hashTagFiled = form.querySelector('.text__hashtags');
    this.textareaField = form.querySelector('.text__description');
    this.pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextTag: 'div',
    });
    this.onResize = this.onResize.bind(this);
  }

  init() {
    this.uploadInput.addEventListener('change', () => {
      this.toggle(true);
      //const inputElement = evt.target;
      //const fileList = inputElement.files;
      //const file = fileList[0];
      //const imageSrc = URL.createObjectURL(file);
      //this.image = imageSrc;
      this.showImage();
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

  toggle(state) {
    if (state) {
      modalManager.add(this);
      this.showModal();
    } else {
      this.closeModal();
    }
  }

  showModal() {
    this.backDrop.classList.remove('hidden');
    document.body.classList.add('modal-open');
    this.createSlider();
    this.scaleBox.addEventListener('click', this.onResize);
    this.effectsList.addEventListener('change', this.onChangeEffect);
  }

  closeModal() {
    this.backDrop.classList.add('hidden');
    document.body.classList.remove('modal-open');
    this.uploadInput.value = '';
    this.uploadedImage.removeAttribute('style');
    this.sliderElement.noUiSlider.destroy();
    this.hashTagFiled.value = '';
    this.textareaField.value = '';
    /* сбрасывание значений */
    this.scaleBox.removeEventListener('click', this.onResize);
    this.effectsList.removeEventListener('change', this.onChangeEffect);

    // if (this.image) {
    //URL.revokeObjectURL(this.image);
    // }
  }

  onSubmit(evt) {
    evt.preventDefault();
    const isValid = this.pristine.validate();
    if (isValid) {
      this.blockSubmitButton();

      sendData('submit', new FormData(evt.target))
        .then(() => this.closeModal())
        .then(() => messageModal.show('success'))
        .catch(() => messageModal.show('error'))
        .finally(() => this.unblockSubmitButton());
    }
  }

  blockSubmitButton() {
    this.submitButton.disabled = true;
  }

  unblockSubmitButton() {
    this.submitButton.disabled = false;
  }


  hide() {
    this.closeModal();
    modalManager.remove(this);
  }


  onResize(evt) {
    const currentInputValue = Number(this.scaleInput.value.replace('%', ''));
    let newInputValue;
    if (evt.target === this.scaleIncreaseButton) {
      newInputValue = Math.min(100, currentInputValue + 25);
      this.scaleInput.value = `${newInputValue}%`;
      this.uploadedImage.style.transform = `scale(${newInputValue / 100})`;
    }
    if (evt.target === this.scaleDecreaseButton) {
      newInputValue = Math.max(25, currentInputValue - 25);
      this.scaleInput.value = `${newInputValue}%`;
      this.uploadedImage.style.transform = `scale(${newInputValue / 100})`;
    }
  }

  /* создаем слайдер */
  createSlider() {
    this.sliderContainer.style.display = 'none';
    noUiSlider.create(this.sliderElement, {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
      connect: 'lower',
      format: {
        to: function (GetsliderValue) {
          if (Number.isInteger(GetsliderValue)) {
            return GetsliderValue;
          }
          return GetsliderValue.toFixed(1);
        },
        from: function (GetsliderValue) {
          return parseFloat(GetsliderValue);
        },
      },
    });
    this.effectsList.addEventListener('change', (evt) => this.onChangeEffect(evt));
  }

  onChangeEffect(evt) {
    const inputValue = evt.target.closest('.effects__radio').value;
    if (inputValue === 'none') {
      this.sliderContainer.style.display = 'none';
      this.uploadedImage.style.filter = 'none';
      this.effectDataField.value = '100%';
      return;
    }

    const { filter, min, max, start, step, unit } = FILTERS[inputValue];

    this.sliderElement.noUiSlider.updateOptions({
      range: {
        min: min,
        max: max
      },
      start: start,
      step: step
    });

    this.sliderContainer.style.display = 'block';
    this.sliderElement.noUiSlider.on('update', () => {
      this.effectDataField.value = `${this.sliderElement.noUiSlider.get()}`;
      const getFilterValue = () => `${filter}(${this.effectDataField.value}${unit})`;
      this.uploadedImage.style.filter = getFilterValue();
    });
  }


  showImage() {
    this.image = this.uploadInput.files[0];
    const fileName = this.image.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      const imageUrl = URL.createObjectURL(this.image);
      this.uploadedImage.src = imageUrl;
      Array.from(this.prewiewImages).forEach((el) => {
        el.style.backgroundImage = `url(${imageUrl})`;
      });
    }
  }
}
export const editor = new Editor(document.querySelector('.img-upload__form'));

