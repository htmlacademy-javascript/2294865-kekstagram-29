import '/vendor/pristine/pristine.min.js';
import '/vendor/nouislider/nouislider.js';
import { isHashtagValid, isRepeatedHashTags, isHashTagLimitExceeded } from './validation.js';
import { FILTERS } from './filtersdata.js';
import {sendData} from './api-fetch.js';
import {messageModal} from './modal-message.js';
import { modals } from './modal.js';


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
  }

  init() {
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

  toggle (state) {
    if (state) {
      modals.add(this);
      this.showModal();
    } else {
      this.closeModal();
    }
  }

  showModal () {
    this.backDrop.classList.remove('hidden');
    document.body.classList.add('modal-open');
    this.createSlider();
    this.scaleBox.addEventListener('click', (evt) => this.onResize(evt));
    this.effectsList.addEventListener('change', (evt) => this.onChangeEffect(evt));
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
    this.scaleBox.removeEventListener('click', (evt) => this.onResize(evt));
    this.effectsList.removeEventListener('change', (evt) => this.onChangeEffect(evt));
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


  hide () {
    this.closeModal();
    modals.remove(this);
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
        to: function (sliderValue) {
          if (Number.isInteger(sliderValue)) {
            return sliderValue;
          }
          return sliderValue.toFixed(1);
        },
        from: function (sliderValue) {
          return parseFloat(sliderValue);
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


  showImage(image) {
    this.image = image;
  }
}

export const editor = new Editor(document.querySelector('.img-upload__form'));
