const MAX_HASHTAG_COUNT = 5;

const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;

//const SCALE_STEP = 25;

const FILTERS = {
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    unit: ''
  },
  none: {
    filter: 'none',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    unit: ''
  }
};

export {
  MAX_HASHTAG_COUNT,
  VALID_SYMBOLS,
  FILTERS
};
