'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constans.js`);
const articles = require(`./articles.js`);
const {ArticlesService, CommentsService} = require(`../data-service`);

const mockData = [
  {
    "id": `AD10VL`,
    "title": `Рок — это протест`,
    "announce": `Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. В лесу родилась елочка, в лесу она росла Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "createdDate": `07.06.2022, 13:57:18`,
    "category": [`Про фигню`, `IT`, `За жизнь`, `Деревья`, `Программирование`, `Крипта`, `Музыка`, `Про игры`, `Мемология`, `Кино`, `Ничего интересного`, `Железо`, `Инвестиции`, `Без рамки`, `Разное`],
    "comments": [
      {"id": `GR9J93`, "text": `Мне кажется или я уже читал это где-то? Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`},
      {"id": `iW1gAa`, "text": `Согласен с автором! Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`}
    ]
  },
  {
    "id": `KVrmL0`,
    "title": `Рок — это протест`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. С другой стороны рамки и место обучения кадров способствует подготовки и реализации модели развития. Из под его пера вышло 8 платиновых альбомов. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Первая большая ёлка была установлена только в 1938 году. Я часто что-то читаю, но часто ничего не понимаю.`,
    "createdDate": `28.06.2022, 03:22:13`,
    "category": [`За жизнь`, `Крипта`, `Программирование`, `IT`, `Музыка`, `Про фигню`, `Без рамки`, `Мемология`, `Про игры`, `Разное`, `Железо`, `Природоведение`, `Инвестиции`
    ],
    "comments": [
      {"id": `QTKnzD`, "text": `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`}
    ]
  },
  {
    "id": `tgc9b0`,
    "title": `Не мешай, я работаю`,
    "announce": `Равным образом консультация с широким активом требуют определения и уточнения модели развития.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "createdDate": `18.06.2022, 14:30:29`,
    "category": [`Про игры`, `Инвестиции`, `Разное`, `За жизнь`, `Ничего интересного`, `Программирование`],
    "comments": [
      {"id": `lM71Lb`, "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Совсем немного...`},
      {"id": `UMG0w8`, "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`}
    ]
  },
  {
    "id": `vxek1j`,
    "title": `Что такое золотое сечение`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Ёлки — это не просто красивое дерево. Это прочная древесина. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? В лесу родилась елочка, в лесу она росла Равным образом консультация с широким активом требуют определения и уточнения модели развития. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. С другой стороны рамки и место обучения кадров способствует подготовки и реализации модели развития. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Я часто что-то читаю, но часто ничего не понимаю. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "createdDate": `03.06.2022, 23:50:52`,
    "category": [`Программирование`, `Железо`, `Разное`, `Природоведение`, `Без рамки`, `За жизнь`, `Деревья`, `Крипта`, `Кино`, `Инвестиции`, `Ничего интересного`],
    "comments": [
      {"id": `SCgjI8`, "text": `Совсем немного...`},
      {"id": `I0iYZL`, "text": `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`},
      {"id": `a29dIe`, "text": `Мне кажется или я уже читал это где-то?`}
    ]
  },
  {
    "id": `PCYIl7`,
    "title": `А пользоваться сторонними сервисами лень`,
    "announce": `С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности способствует подготовки и реализации форм развития.`,
    "createdDate": `27.04.2022, 03:17:30`,
    "category": [`Крипта`, `IT`, `Деревья`, `Кино`, `Про игры`, `Программирование`, `За жизнь`, `Разное`, `Музыка`, `Железо`, `Ничего интересного`, `Без рамки`],
    "comments": [
      {"id": `joG2mp`, "text": `Совсем немного... Планируете записать видосик на эту тему?`},
      {"id": `n0wglP`, "text": `Планируете записать видосик на эту тему?`}
    ]
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticlesService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const ARTICLE_QUANTITY = 5;
  const ARTICLE_ID = `AD10VL`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of ${ARTICLE_QUANTITY} articles`, () => expect(response.body.length).toBe(ARTICLE_QUANTITY));

  test(`First article's id equals "${ARTICLE_ID}"`, () => expect(response.body[0].id).toBe(ARTICLE_ID));
});

describe(`API returns an article with given id`, () => {
  const ARTICLE_ID = `tgc9b0`;
  const ARTICLE_TITLE = `Не мешай, я работаю`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "${ARTICLE_TITLE}"`, () => expect(response.body.title).toBe(ARTICLE_TITLE));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Новый title`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: `Новая категория`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => {
    return request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(mockData.length + 1));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Новый title`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: `Новая категория`,
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existing article - positive cases`, () => {
  const ARTICLE_ID = `PCYIl7`;
  const newArticle = {
    title: `Новый title`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: `Новая категория`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${ARTICLE_ID}`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`article is really changed`, () => request(app)
    .get(`/articles/${ARTICLE_ID}`)
    .expect((res) => expect(res.body.title).toBe(newArticle.title))
  );
});

describe(`API changes existing article - negative cases`, () => {
  const ARTICLE_ID = `PCYIl7`;
  const BAD_ARTICLE_ID = `VerYBadId_`;
  const newArticle = {
    title: `Новый title`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: `Новая категория`,
  };
  const brokenArticlePayload = {
    title: `Новый title`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
  };

  test(`API returns status code 404 when trying to change non-existent article`, () => {
    const app = createAPI();

    return request(app)
      .put(`/articles/${BAD_ARTICLE_ID}`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an article with invalid payload`, () => {
    const app = createAPI();

    return request(app)
      .put(`/articles/${ARTICLE_ID}`)
      .send(brokenArticlePayload)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`Delete the article - positive cases`, () => {
  const ARTICLE_ID = `PCYIl7`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(ARTICLE_ID));

  test(`Article count is 4 now`, async () => {
    let res = await request(app).get(`/articles`);
    return expect(res.body.length).toBe(4);
  });
});

describe(`Delete the article - negative cases`, () => {
  const BAD_ARTICLE_ID = `VerYBadId_`;
  const app = createAPI();

  test(`API refuses to delete non-existent article`, () => {
    return request(app)
      .delete(`/articles/${BAD_ARTICLE_ID}`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидный комменетарий`,
    id: 1
  };
  const ARTICLE_ID = `KVrmL0`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
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
  const BAD_ARTICLE_ID = `VerYBadId_`;
  const app = createAPI();

  return request(app)
    .post(`/articles/${BAD_ARTICLE_ID}/comments`)
    .send({
      text: `Разницы нет, все равно запнется на не существующей статье`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const ARTICLE_ID = `KVrmL0`;
  const invalidComment = {
    text: `Комментарий без указания userId (id)`
  };

  const app = createAPI();

  return request(app)
    .post(`/articles/${ARTICLE_ID}/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const ARTICLE_ID = `tgc9b0`;
  const ARTICLE_COMMENT_USER_ID = `lM71Lb`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${ARTICLE_ID}/comments/${ARTICLE_COMMENT_USER_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/${ARTICLE_ID}/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const ARTICLE_ID = `tgc9b0`;
  const BAD_ARTICLE_COMMENT_USER_ID = `BadUommnetusrId_`;
  const app = createAPI();

  return request(app)
    .delete(`/articles/${ARTICLE_ID}/comments/${BAD_ARTICLE_COMMENT_USER_ID}`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const BAD_ARTICLE_ID = `VerYBadId_`;
  const ARTICLE_COMMENT_USER_ID = `lM71Lb`;
  const app = createAPI();

  return request(app)
    .delete(`/articles/${BAD_ARTICLE_ID}/comments/${ARTICLE_COMMENT_USER_ID}`)
    .expect(HttpCode.NOT_FOUND);
});
