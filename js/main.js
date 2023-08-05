
import {getData} from './api-fetch.js';
import {showAlert} from './util.js';
import Gallary from './gallery.js';
import './editor.js';
import {editor} from './editor.js';
import '.modal-manager.js/';


getData('fetch')
  .then((pictures) => {
    const gallery = new Gallary(pictures);
    gallery.render();
  })
  .catch(
    (err) => {
      showAlert(err.message);
    }
  );

editor.init();
