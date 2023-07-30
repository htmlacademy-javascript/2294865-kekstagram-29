const MAX_HASHTAG_COUNT = 5; /* Массив хештегов*/
const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i; /* Расрешенные символы */

const hashTags = (value) => value.trim().split(' ').filter((el) => el.length !== 0);

const isHashtagValid = (value) => hashTags(value).every((el) => VALID_SYMBOLS.test(el));

const isRepeatedHashTags = (value) => {

  const lowerCaseHashTags = hashTags(value).map((el) => el.toLowerCase());
  const newHashTags = Array.from(new Set(lowerCaseHashTags));
  return newHashTags.length === hashTags(value).length;
};

const isHashTagLimitExceeded = (value) => hashTags(value).length <= MAX_HASHTAG_COUNT;

export {isHashtagValid, isRepeatedHashTags, isHashTagLimitExceeded};
