const FETCH_URL = 'https://29.javascript.pages.academy/kekstagram';

const API = {
  fetch: {
    path: '/data',
    method: 'GET',
    message: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  },
  submit: {
    path: '',
    method: 'POST',
    message: 'Не удалось отправить форму. Попробуйте ещё раз',
  },
};

/**
 * @param {'fetch' | 'submit'} type
 */

const load = (type, body = null) =>
  fetch(`${FETCH_URL}${API[type].path}`,
    {
      method: API[type].method,
      body
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(API[type].message);
    });

const getData = (type) => load(type);

const sendData = (type,body) => load(type,body);

export {getData, sendData};
