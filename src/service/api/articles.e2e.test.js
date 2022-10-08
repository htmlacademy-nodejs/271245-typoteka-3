'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDatabase = require(`../lib/init-db.js`);
const passwordUtils = require(`../lib/password.js`);
const {HttpCode} = require(`../../constants.js`);
const articles = require(`./articles.js`);
const {ArticlesService, CommentsService} = require(`../data-service`);

const mockUsers = [
  {
    email: `test1@ya.ru`,
    passwordHash: passwordUtils.hashSync(`igorev`),
    name: `Egor`,
    surname: `Igorev`,
    avatar: `test_avatar_1.png`
  },
  {
    email: `test2@google.ru`,
    passwordHash: passwordUtils.hashSync(`egorov`),
    name: `Igor`,
    surname: `Egorov`,
    avatar: `test_avatar_2.png`
  }
];

const mockCategories = [`Деревья`, `Кино`, `Крипта`, `Про игры`, `Музыка`];

const mockData = [
  {
    "user": `test1@ya.ru`,
    "title": `А пользоваться сторонними сервисами лень`,
    "announcement": `С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "mainText": `Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "category": [`Деревья`],
    "comments": [
      {"user": `test2@google.ru`, "text": `Совсем немного... Планируете записать видосик на эту тему?`},
    ]
  },
  {
    "user": `test1@ya.ru`,
    "title": `Рок — это протест`,
    "announcement": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "mainText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. С другой стороны рамки и место обучения кадров способствует подготовки и реализации модели развития. Из под его пера вышло 8 платиновых альбомов. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Первая большая ёлка была установлена только в 1938 году. Я часто что-то читаю, но часто ничего не понимаю.`,
    "category": [`Кино`, `Крипта`],
    "comments": [
      {"user": `test1@ya.ru`, "text": `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`}
    ]
  },
  {
    "user": `test2@google.ru`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announcement": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. В лесу родилась елочка, в лесу она росла`,
    "mainText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. С другой стороны рамки и место обучения кадров способствует подготовки и реализации модели развития. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. В лесу родилась елочка, в лесу она росла`,
    "category": [`Про игры`, `Музыка`],
    "comments": [
      {"user": `test1@ya.ru`, "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`},
    ]
  },
  {
    "user": `test2@google.ru`,
    "title": `Что такое золотое сечение`,
    "announcement": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "mainText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Ёлки — это не просто красивое дерево. Это прочная древесина. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? В лесу родилась елочка, в лесу она росла Равным образом консультация с широким активом требуют определения и уточнения модели развития. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. С другой стороны рамки и место обучения кадров способствует подготовки и реализации модели развития. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Я часто что-то читаю, но часто ничего не понимаю. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "category": [`Крипта`, `Про игры`, `Музыка`],
    "comments": [
      {"user": `test2@google.ru`, "text": `Совсем немного...`},
    ]
  },
  {
    "user": `test1@ya.ru`,
    "title": `Как собрать камни бесконечности`,
    "announcement": `Я часто что-то читаю, но часто ничего не понимаю.`,
    "mainText": `Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. В лесу родилась елочка, в лесу она росла Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. С другой стороны рамки и место обучения кадров способствует подготовки и реализации модели развития. Из под его пера вышло 8 платиновых альбомов. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Ёлки — это не просто красивое дерево. Это прочная древесина. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Я часто что-то читаю, но часто ничего не понимаю. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году.`,
    "category": [`Деревья`, `Крипта`, `Музыка`],
    "comments": [
      {"user": `test2@google.ru`, "text": `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`}
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDatabase(mockDB, {categoryList: mockCategories, publications: mockData, users: mockUsers});
  const app = express();
  app.use(express.json());
  articles(app, new ArticlesService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const ARTICLE_QUANTITY = 5;
  // const FIRST_ARTICLE_TITLE = `А пользоваться сторонними сервисами лень`;
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of ${ARTICLE_QUANTITY} articles`, () => expect(response.body.length).toBe(ARTICLE_QUANTITY));

  // test(`First article's title equals "${FIRST_ARTICLE_TITLE}"`, () => expect(response.body[0].title).toBe(FIRST_ARTICLE_TITLE));
});

describe(`API returns an article with given id`, () => {
  const ARTICLE_ID = 5;
  const ARTICLE_TITLE = `Как собрать камни бесконечности`;
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/${ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "${ARTICLE_TITLE}"`, () => expect(response.body.title).toBe(ARTICLE_TITLE));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    userId: 1,
    title: `Новый title! Но надо учитывать, то что длина тайтла должна быть от 30 до 250 символов`,
    announcement: `Новый анонс! Но надо учитывать, то что длина анонса должна быть от 30 до 250 символов`,
    mainText: `Новый текст`,
    categories: [1, 2],
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => {
    return request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(mockData.length + 1));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Новый title!`,
    announcement: `Новый анонс!`,
    mainText: `Новый текст`,
    categories: [1, 2],
  };
  let app;

  test(`Without any required property response code is 400`, async () => {
    app = await createAPI();
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong or not valid response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: 111},
      {...newArticle, announcement: 222},
      {...newArticle, categories: []}
    ];
    for (const article of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(article)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existing article - positive cases`, () => {
  const ARTICLE_ID = 1;
  const newArticle = {
    userId: 1,
    title: `Новый title! Но надо учитывать, то что длина тайтла должна быть от 30 до 250 символов`,
    announcement: `Новый анонс! Но надо учитывать, то что длина анонса должна быть от 30 до 250 символов`,
    mainText: `Новый текст`,
    categories: [1, 2],
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/${ARTICLE_ID}`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(true));

  test(`article is really changed`, () => request(app)
    .get(`/articles/${ARTICLE_ID}`)
    .expect((res) => expect(res.body.title).toBe(newArticle.title))
  );
});

describe(`API changes existing article - negative cases`, () => {
  const ARTICLE_ID = 1;
  const BAD_ARTICLE_ID = 666;
  const newArticle = {
    title: `Новый title`,
    announcement: `Новый анонс`,
    mainText: `Новый текст`,
    categories: [1, 2],
  };
  const brokenArticlePayload = {
    title: `Новый title`,
    announcement: `Новый анонс`,
    mainText: `Новый текст`,
  };

  test(`API returns status code 404 when trying to change non-existent article`, async () => {
    const app = await createAPI();

    return request(app)
      .put(`/articles/${BAD_ARTICLE_ID}`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an article with invalid payload`, async () => {
    const app = await createAPI();

    return request(app)
      .put(`/articles/${ARTICLE_ID}`)
      .send(brokenArticlePayload)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`Delete the article - positive cases`, () => {
  const ARTICLE_ID = 3;
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/${ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body).toBe(true));

  test(`Article count is 4 now`, async () => {
    let res = await request(app).get(`/articles`);
    return expect(res.body.length).toBe(4);
  });
});

describe(`Delete the article - negative cases`, () => {
  const BAD_ARTICLE_ID = 666;
  let app;

  test(`API refuses to delete non-existent article`, async () => {
    app = await createAPI();
    return request(app)
      .delete(`/articles/${BAD_ARTICLE_ID}`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    userId: 1,
    text: `Валидный комментарий`
  };
  const ARTICLE_ID = 1;
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/${ARTICLE_ID}/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/${ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const BAD_ARTICLE_ID = 666;
  const app = await createAPI();

  return request(app)
    .post(`/articles/${BAD_ARTICLE_ID}/comments`)
    .send({
      text: `Разницы нет, все равно запнется на не существующей статье`
    })
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const ARTICLE_ID = 1;
  const COMENT_ID = 1;
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/${ARTICLE_ID}/comments/${COMENT_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/${ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(0))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const ARTICLE_ID = 2;
  const BAD_COMMENT_ID = 666;
  const app = await createAPI();

  return request(app)
    .delete(`/articles/${ARTICLE_ID}/comments/${BAD_COMMENT_ID}`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const BAD_ARTICLE_ID = 666;
  const COMMENT_ID = 1;
  const app = await createAPI();

  return request(app)
    .delete(`/articles/${BAD_ARTICLE_ID}/comments/${COMMENT_ID}`)
    .expect(HttpCode.NOT_FOUND);
});
