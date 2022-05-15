'use strict';

const fs = require(`fs`);
const {getRandomInt, shuffle, createDate} = require(`../../utils.js`);
const {TITLES, SENTENCES, CATEGORY} = require(`../../mock-data/mock-data.js`);
const {ExitCode} = require(`../../constans.js`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const ANNOUNCE_MAX_COUNT = 5;
const FILE_NAME = `mock.json`;
const THREE_MONTH_TIMESTAMP = 86400000 * 7 * 4 * 3;

const generatePublication = (count) => {
  return Array(count).fill({}).map(() => {
    return {
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      announce: shuffle(SENTENCES).slice(0, getRandomInt(0, ANNOUNCE_MAX_COUNT)).join(` `),
      fullText: shuffle(SENTENCES).slice(0, getRandomInt(0, SENTENCES.length - 1)).join(` `),
      createdDate: createDate(Date.now() - THREE_MONTH_TIMESTAMP, Date.now()),
      сategory: shuffle(CATEGORY).slice(0, getRandomInt(0, CATEGORY.length - 1)),
    };
  });
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer >= MAX_COUNT) {
      console.log(`Не больше ${MAX_COUNT} публикаций`);
      process.exit(ExitCode.ERROR);
    }
    const content = JSON.stringify(generatePublication(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        process.exit(ExitCode.ERROR);
      }
      return console.info(`Operation success. File created.`);
    });
  },
};
