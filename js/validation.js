import {MAX_HASHTAG_COUNT, VALID_SYMBOLS} from './filtersdata.js';

const hashTags = (value) => value.trim().split(' ').filter((el) => el.length !== 0);

const isHashtagValid = (value) => hashTags(value).every((el) => VALID_SYMBOLS.test(el));

const isRepeatedHashTags = (value) => {

  const lowerCaseHashTags = hashTags(value).map((el) => el.toLowerCase());
  const newHashTags = Array.from(new Set(lowerCaseHashTags));
  return newHashTags.length === hashTags(value).length;
};

const isHashTagLimitExceeded = (value) => hashTags(value).length <= MAX_HASHTAG_COUNT;

export {isHashtagValid, isRepeatedHashTags, isHashTagLimitExceeded};
