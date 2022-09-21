'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants.js`);

const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  ANNOUNCEMENT_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCEMENT_MAX: `Анонс не может содержать более 250 символов`,
  MAIN_TEXT_MIN: `Основной текст содержит меньше 1 символа`,
  MAIN_TEXT_MAX: `Основной текст не может содержать более 1000 символов`,
  PICTURE: `Тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`,
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  announcement: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCEMENT_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCEMENT_MAX
  }),
  picture: Joi.string().allow(null).messages({
    'string.empty': ErrorArticleMessage.PICTURE
  }),
  mainText: Joi.string().allow(``).min(1).max(1000).messages({
    'string.min': ErrorArticleMessage.MAIN_TEXT_MIN,
    'string.max': ErrorArticleMessage.MAIN_TEXT_MAX
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  })
});

const articleValidation = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

module.exports = articleValidation;
