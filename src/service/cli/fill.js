'use strict';

const {readFile, writeFile} = require(`fs`).promises;
const {green, red} = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils.js`);
const {ExitCode} = require(`../../constans.js`);

const DEFAULT_COUNT = 1;
const PUBLICATION_MAX_COUNT = 1000;
const ANNOUNCE_MAX_COUNT = 5;
const FULL_TEXT_MAX_COUNT = 5;
const CATEGORY_MAX_COUNT = 5;
const COMMENTS_MAX_COUNT = 4;
const FILE_NAME = `./db/fill-db.sql`;
const TITLE_FILE_PATH = `./data/titles.txt`;
const CATEGORIES_FILE_PATH = `./data/categories.txt`;
const SENTENCES_FILE_PATH = `./data/sentences.txt`;
const COMMENTS_FILE_PATH = `./data/comments.txt`;
const PUBLICATION_PICTURE_LIST = [`test_picture_1.png`, `test_picture_2.jpg`, `test_picture_3.jpeg`, `test_picture_4.png`];

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

const generatePublicationPicture = () => {
  const picture = PUBLICATION_PICTURE_LIST[getRandomInt(0, PUBLICATION_PICTURE_LIST.length)];
  return picture ? `'${picture}'` : null;
};

const getContentList = async (filePath) => {
  try {
    const fileContent = await readFile(filePath, `utf8`);
    return fileContent.trim().split(/\r?\n/);
  } catch (error) {
    console.error(red.bold(`Can't read file, because ${error}`));
    return [``];
  }
};

const createComments = (commentCount, commentList, publicationIid, userCount) => {
  return Array(commentCount).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    publicationIid,
    text: shuffle(commentList)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const createCategory = (categoryCount) => {
  let categiries = new Array(getRandomInt(1, CATEGORY_MAX_COUNT)).fill(null).map(() => getRandomInt(1, categoryCount));
  return [...new Set(categiries)];
};

const generatePublication = (count, titles, sentences, comments, categoryCount, userCount) => {
  return Array(count).fill({}).map((_, index) => ({
    userId: getRandomInt(1, userCount),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_MAX_COUNT)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(0, FULL_TEXT_MAX_COUNT)).join(` `),
    category: createCategory(categoryCount),
    comments: createComments(getRandomInt(1, COMMENTS_MAX_COUNT), comments, index + 1, userCount),
  }));
};

const setSqlQueryString = (userValues, categoryValues, publicationValues, categoryPublicationValues, commentValues) => {
  return `/* Comment the TRUNCATE block if you don't need reset DT */
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE categories RESTART IDENTITY CASCADE;
TRUNCATE publications RESTART IDENTITY CASCADE;
TRUNCATE categories_publications RESTART IDENTITY CASCADE;
TRUNCATE comments RESTART IDENTITY CASCADE;

INSERT INTO users(email, password_hash, firstname, lastname, avatar) VALUES
${userValues};

INSERT INTO categories(title) VALUES
${categoryValues};

--disable it in case there are no users DT in the DB yet
ALTER TABLE publications DISABLE TRIGGER ALL;
INSERT INTO publications(title, picture, announcement, main_text, user_id) VALUES
${publicationValues};
ALTER TABLE publications ENABLE TRIGGER ALL;

--disable it in case there are no categories/publications DT in the DB yet
ALTER TABLE categories_publications DISABLE TRIGGER ALL;
INSERT INTO categories_publications(category_id, publication_id) VALUES
${categoryPublicationValues};
ALTER TABLE categories_publications ENABLE TRIGGER ALL;

--disable it in case there are no publications/users DT in the DB yet
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(publication_id, user_id, main_text) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;
  `;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countPublications >= PUBLICATION_MAX_COUNT) {
      console.log(red.bold(`Не больше ${PUBLICATION_MAX_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const titleList = await getContentList(TITLE_FILE_PATH);
    const categoryList = await getContentList(CATEGORIES_FILE_PATH);
    const sentencesList = await getContentList(SENTENCES_FILE_PATH);
    const commentList = await getContentList(COMMENTS_FILE_PATH);

    const publications = generatePublication(countPublications, titleList, sentencesList, commentList, categoryList.length, userList.length);
    const comments = publications.flatMap((publication) => publication.comments);
    const categoriesPublications = publications.reduce((acc, item, index) => {
      item.category.forEach((category) => {
        acc.push({
          publicationIid: index + 1,
          categoryId: category
        });
      });
      return acc;
    }, []);

    console.log(publications);
    console.log(categoriesPublications);

    const userValues = userList.map((user) => `('${user.email}', '${user.passwordHash}', '${user.firstName}', '${user.lastName}', '${user.avatar}')`).join(`,\n`);
    const categoryValues = categoryList.map((title) => `('${title}')`).join(`,\n`);
    const publicationValues = publications.map((publication) =>`('${publication.title}', ${generatePublicationPicture()}, '${publication.announce}', '${publication.fullText}', ${publication.userId})`).join(`,\n`);
    const categoryPublicationValues = categoriesPublications.map((item) =>`(${item.categoryId}, ${item.publicationIid})`).join(`,\n`);
    const commentValues = comments.map((item) =>`(${item.publicationIid}, ${item.userId}, '${item.text}')`).join(`,\n`);

    const content = setSqlQueryString(userValues, categoryValues, publicationValues, categoryPublicationValues, commentValues);

    try {
      await writeFile(FILE_NAME, content);
      console.info(green.bold(`Operation success. File created.`));
    } catch (error) {
      console.error(red.bold(`Can't write data to file, because ${error}`));
      process.exit(ExitCode.ERROR);
    }
  },
};
