'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  const arrCopy = someArray.slice();
  for (let i = arrCopy.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [arrCopy[i], arrCopy[randomPosition]] = [arrCopy[randomPosition], arrCopy[i]];
  }

  return arrCopy;
};

const createDate = (minDate, currentDate) => {
  const range = getRandomInt(minDate, currentDate);
  return new Intl.DateTimeFormat(`ru-RU`, {
    year: `numeric`, month: `numeric`, day: `numeric`,
    hour: `numeric`, minute: `numeric`, second: `numeric`,
  }).format(range);
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports = {
  getRandomInt,
  shuffle,
  createDate,
  ensureArray,
};
