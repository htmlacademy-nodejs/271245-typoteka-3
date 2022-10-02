'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCategoryMessage = {
  CATEGORY_EXIST: `Такая категория уже существует`,
  CATEGORY_MIN: `Категория содержит меньше 5-ти символов`,
  CATEGORY_MAX: `Категория содержит более 30-ти символов`,
  CATEGORY_EMPTY: `Поле не может быть пустым`,
  PATTERN: `Использованны недопустимые символы`,
};

const schema = Joi.object({
  newCategory: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).min(5).max(30).required().messages({
    'string.min': ErrorCategoryMessage.CATEGORY_MIN,
    'string.max': ErrorCategoryMessage.CATEGORY_MAX,
    'string.empty': ErrorCategoryMessage.CATEGORY_EMPTY,
    'string.pattern.base': ErrorCategoryMessage.PATTERN
  }),
});

const categoryValidation = (service) => {
  return async (req, res, next) => {
    const newCategory = req.body;
    const {error} = schema.validate(newCategory, {abortEarly: false});

    if (error) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(error.details.map((err) => err.message).join(`\n`));
    }

    const categoryByName = await service.findByCategoryName(req.body.newCategory);

    if (categoryByName) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(ErrorCategoryMessage.CATEGORY_EXIST);
    }

    return next();
  };
};

module.exports = categoryValidation;
