import { isEscapeKey } from './util.js';

class ModalManager {
  constructor() {
    this.showed = [];
    this.onKeydown = this.onKeydown.bind(this);
  }

  add(modal) {
    this.showed.push(modal);
  }

  remove(modal) {
    this.showed = this.showed.filter((item) => item !== modal);
  }

  onKeydown(evt) {
    if (this.showed.length === 0) {
      return;
    }

    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }

    if (evt.target.closest('.img-upload__field-wrapper')) {
      return;
    }

    if (isEscapeKey(evt)) {
      evt.preventDefault ();
      const modal = this.showed.pop();

      if (!modal) {
        return;

      }
      modal.hide();
    }
  }

  init() {
    document.addEventListener('keydown', this.onKeydown);
  }
}

export const modalManager = new ModalManager();

modalManager.init();
