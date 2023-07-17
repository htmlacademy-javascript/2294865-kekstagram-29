const MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

const NAMES = [
  'Александров Марк',
  'Высоцкая Екатерина',
  'Ковалев Арсений',
  'Ильинский Матвей',
  'Павлова Анна',
  'Хохлов Демид',
  'Лебедева Виктория',
  'Беляев Андрей',
  'Лазарева Мария',
  'Кузнецова Мария',
  'Поздняков Савелий',
  'Иванова Эмилия',
  'Митрофанов Артемий',
  'Косарева Алиса',
  'Семенов Никита',
  'Седова Ксения',
  'Козырева Ярослава',
  'Беляева Вероника',
  'Алексеева Вера',
  'Богданова Полина',
  'Ананьев Пётр',
  'Козлов Роман',
  'Шилова Валерия',
  'Орлова Ксения',
  'Леонова Виктория',
  'Григорьев Максим',
  'Потапов Денис',
  'Матвеева Виктория',
  'Васильев Михаил'
];

const DESCRIPTIONS = ['храм',
  'боб',
  'алтарь',
  'звонок',
  'грядка',
  'блок',
  'гадюка',
  'платок',
  'шуба',
  'губа',
  'ломбард',
  'бутылка',
  'корректор',
  'кайма',
  'леопард',
  'дефект',
  'ракета',
  'Воронеж',
  'коробок',
  'авиашкола',
  'лава',
  'воробей',
  'кий',
  'маргарин',
  'коктейль'];

const PHOTO_OBJECTS_COUNT = 25;


const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const createUniqueId = (min, max) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const generateCommentId = createUniqueId(1, 9999);
const generatePhotoId = createUniqueId(0, DESCRIPTIONS.length);

/* создает комментарий */
const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

/* создает описание */
const createPhotoDescription = () => {
  const photoId = generatePhotoId();
  return {
    id: photoId,
    url: `photos/${photoId}.jpg`,
    description: DESCRIPTIONS[photoId - 1],
    likes: getRandomInteger(15, 200),
    comments: Array.from({length: getRandomInteger(0, 30)}, createComment)
  };
};


const createPhotoDescriptions = () => Array.from({length: PHOTO_OBJECTS_COUNT}, createPhotoDescription);

export {createPhotoDescriptions};

