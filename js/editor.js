import '/vendor/pristine/pristine.min.js';
import { isEscapeKey } from './util.js';
import '/vendor/nouislider/nouislider.js';
import { isHashtagValid, isRepeatedHashTags, isHashTagLimitExceeded } from './validators.js';
import { FILTERS } from './filtersdata.js';

class Editor {
  constructor(form) {
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

  onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      if (evt.target.closest('.img-upload__field-wrapper')) {
        return;
      }
      this.closeBackDrop();
    }
  }

  showBackdrop() {
    this.backDrop.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  closeBackDrop() {
    this.backDrop.classList.add('hidden');
    document.body.classList.remove('modal-open');
    this.uploadInput.value = '';
    this.hashTagFiled.value = '';
    this.textareaField.value = '';
    /* сбрасывание значений */
  }

  onSubmit(evt) {
    evt.preventDefault();
    const valid = this.pristine.validate();
    window.console.log('!!!', valid);
  }

  toggle(state) {
    if (state) {
      this.showBackdrop();
      document.addEventListener('keydown', (evt) => this.onDocumentKeydown(evt));
      this.scaleBox.addEventListener('click', (evt) => this.onResize(evt));
      this.effectsList.addEventListener('change', (evt) => this.onChangeEffect(evt));
    } else {
      this.closeBackDrop();
      document.removeEventListener('keydown', (evt) => this.onDocumentKeydown(evt));
      this.scaleBox.removeEventListener('click', (evt) => this.onResize(evt));
      this.effectsList.removeEventListener('change', (evt) => this.onResize(evt));
    }
  }

  onResize(evt) {
    const currentInputValue = Number(this.scaleInput.value.replace('%', '')); /* /[^d\]/g,"" лучше все же сделать так? */
    let newInputValue;
    if (evt.target === this.scaleIncreaseButton) {
      //if (currentInputValue === 25) {
      // return;
      // }

      newInputValue = Math.min(100, currentInputValue + 25);
      this.scaleInput.value = `${newInputValue}%`;
      this.uploadedImage.style.transform = `scale(${newInputValue / 100})`;
    }
    if (evt.target === this.scaleDecreaseButton) {
      // if (currentInputValue === 100) {
      //  return;
      // }

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
      this.uploadedImage.style.filter = `${filter}(${this.effectDataField.value}${unit})`;
    });
  }


  showImage(image) {
    this.image = image;
  }
}

const editor = new Editor(document.querySelector('.img-upload__form'));

editor.init();
