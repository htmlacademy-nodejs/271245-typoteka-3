'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const createDate = (minDate, currentDate) => {
  let range = getRandomInt(minDate, currentDate);
  return new Intl.DateTimeFormat(`ru-RU`, {
    year: `numeric`, month: `numeric`, day: `numeric`,
    hour: `numeric`, minute: `numeric`, second: `numeric`,
  }).format(range);
};

module.exports = {
  getRandomInt,
  shuffle,
  createDate,
};
