
import {getData} from './api-fetch.js';
import {showAlert} from './util.js';
import Gallery from './gallery.js';
import './editor.js';
import {editor} from './editor.js';
import './modal-manager.js';


getData('fetch')
  .then((pictures) => {
    const gallery = new Gallery(pictures);
    gallery.render();
  })
  .catch(
    (err) => {
      showAlert(err.message);
    }
  );

editor.init();
