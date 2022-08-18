'use strict';

const sequelize = require(`../lib/sequelize.js`);
const defineAllModel = require(`../models`);
const Aliase = require(`../models/aliase.js`);

const {getLogger} = require(`../lib/logger.js`);
const {readFile} = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils.js`);
const {ExitCode} = require(`../../constans.js`);

const DEFAULT_COUNT = 1;
const PUBLICATION_MAX_COUNT = 1000;
const ANNOUNCE_MAX_COUNT = 5;
const COMMENTS_MAX_COUNT = 4;
const FULL_TEXT_MAX_COUNT = 5;
const [TITLE_FILE_PATH, CATEGORIES_FILE_PATH, SENTENCES_FILE_PATH, COMMENTS_FILE_PATH] = [`./data/titles.txt`, `./data/categories.txt`, `./data/sentences.txt`, `./data/comments.txt`];

const logger = getLogger({name: `fillDb`});

const userList = [
  {
    email: `test1@ya.ru`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Test1_fistname`,
    lastName: `Test1_lastname`,
    avatar: `test_avatar_1.png`
  },
  {
    email: `test2@google.ru`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Test2_fistname`,
    lastName: `Test2_lastname`,
    avatar: `test_avatar_2.png`
  }
];

const getContentList = async (filePath) => {
  try {
    const fileContent = await readFile(filePath, `utf8`);
    return fileContent.trim().split(/\r?\n/);
  } catch (error) {
    logger.error(`Can't read file, because ${error}`);
    return [``];
  }
};

const getContentMatrix = () => {
  return Promise.all([
    getContentList(TITLE_FILE_PATH),
    getContentList(CATEGORIES_FILE_PATH),
    getContentList(SENTENCES_FILE_PATH),
    getContentList(COMMENTS_FILE_PATH),
  ]);
};

const createComments = (commentCount, commentList) => {
  return Array(commentCount).fill({}).map(() => ({
    text: shuffle(commentList)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const getRandomSubarray = (items) => {
  return shuffle(items).slice(0, getRandomInt(1, items.length));
};

const setPublicationCount = (cliArg) => {
  const [count] = cliArg;
  return Number.parseInt(count, 10) || DEFAULT_COUNT;
};

const generatePublication = (count, titles, sentences, comments, categories, userCount) => {
  return Array(count).fill({}).map((_) => ({
    userId: getRandomInt(1, userCount),
    title: titles[getRandomInt(0, titles.length - 1)],
    announcement: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_MAX_COUNT)).join(` `),
    mainText: shuffle(sentences).slice(0, getRandomInt(0, FULL_TEXT_MAX_COUNT)).join(` `),
    category: getRandomSubarray(categories),
    comments: createComments(getRandomInt(1, COMMENTS_MAX_COUNT), comments),
  }));
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const countPublications = setPublicationCount(args);
    if (countPublications >= PUBLICATION_MAX_COUNT) {
      logger.error(`Не больше ${PUBLICATION_MAX_COUNT} публикаций`);
      process.exit(ExitCode.ERROR);
    }

    const {Category, Publication} = defineAllModel(sequelize);
    await sequelize.sync({force: true});

    const [titleList, categoryList, sentencesList, commentList] = await getContentMatrix();

    const categoryDBValues = categoryList.map((item) => ({title: item}));
    const categoryModels = await Category.bulkCreate(categoryDBValues);

    const publications = generatePublication(countPublications, titleList, sentencesList, commentList, categoryModels, userList.length);

    const publicationPromises = publications.map(async (publication) => {
      const publicationModel = await Publication.create(publication, {include: [Aliase.COMMENTS]});
      await publicationModel.addCategories(publication.category, {});
    });
    await Promise.all(publicationPromises);
    // console.log(publications);
  },
};
