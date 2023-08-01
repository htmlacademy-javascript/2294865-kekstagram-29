
import {getData} from './api-fetch.js';
import {showAlert} from './util.js';
import {renderGallery} from './gallery.js';
import './editor.js';
import {editor} from './editor.js';

getData('fetch')
  .then((pictures) => {
    renderGallery(pictures);
  })
  .catch(
    (err) => {
      showAlert(err.message);
    }
  );

editor.init();
