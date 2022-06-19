'use strict';

const {readFile, writeFile} = require(`fs`).promises;
const {green, red} = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffle, createDate} = require(`../../utils.js`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constans.js`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const ANNOUNCE_MAX_COUNT = 5;
const COMMENTS_MAX_COUNT = 4;
const FILE_NAME = `mock.json`;
const THREE_MONTH_TIMESTAMP = 86400000 * 7 * 4 * 3;
const TITLE_FILE_PATH = `./data/titles.txt`;
const CATEGORIES_FILE_PATH = `./data/categories.txt`;
const SENTENCES_FILE_PATH = `./data/sentences.txt`;
const COMMENTS_FILE_PATH = `./data/comments.txt`;

const getContentList = async (filePath) => {
  try {
    const fileContent = await readFile(filePath, `utf8`);
    return fileContent.trim().split(/\r?\n/);
  } catch (error) {
    console.error(red.bold(`Can't read file, because ${error}`));
    return [``];
  }
};

const createComments = (commentCount, commentList) => {
  return Array(commentCount).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(commentList)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generatePublication = (count, titles, category, sentences, comments) => {
  return Array(count).fill({}).map(() => {
    return {
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences).slice(0, getRandomInt(0, ANNOUNCE_MAX_COUNT)).join(` `),
      fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
      createdDate: createDate(Date.now() - THREE_MONTH_TIMESTAMP, Date.now()),
      сategory: shuffle(category).slice(0, getRandomInt(0, category.length - 1)),
      comments: createComments(getRandomInt(1, COMMENTS_MAX_COUNT), comments),
    };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer >= MAX_COUNT) {
      console.log(red.bold(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const contentMatrix = await Promise.all([
      getContentList(TITLE_FILE_PATH),
      getContentList(CATEGORIES_FILE_PATH),
      getContentList(SENTENCES_FILE_PATH),
      getContentList(COMMENTS_FILE_PATH),
    ]);

    const content = JSON.stringify(generatePublication(countOffer, ...contentMatrix));

    try {
      await writeFile(FILE_NAME, content);
      console.info(green.bold(`Operation success. File created.`));
    } catch (error) {
      console.error(red.bold(`Can't write data to file, because ${error}`));
      process.exit(ExitCode.ERROR);
    }
  },
};
