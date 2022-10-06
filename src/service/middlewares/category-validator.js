'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCategoryMessage = {
  CATEGORY_EXIST: `Такая категория уже существует`,
  CATEGORY_MIN: `Категория содержит меньше 5-ти символов`,
  CATEGORY_MAX: `Категория содержит более 30-ти символов`,
  CATEGORY_EMPTY: `Поле не может быть пустым`,
  PATTERN: `Использованны недопустимые символы`,
  CATEGORY_ID: `Использованны недопустимые символы!!!!!!`,
};

const newCategorySchema = Joi.object({
  newCategory: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).min(5).max(30).required().messages({
    'string.min': ErrorCategoryMessage.CATEGORY_MIN,
    'string.max': ErrorCategoryMessage.CATEGORY_MAX,
    'string.empty': ErrorCategoryMessage.CATEGORY_EMPTY,
    'string.pattern.base': ErrorCategoryMessage.PATTERN
  }),
});

const editCategorySchema = Joi.object({
  newCategory: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).min(5).max(30).required().messages({
    'string.min': ErrorCategoryMessage.CATEGORY_MIN,
    'string.max': ErrorCategoryMessage.CATEGORY_MAX,
    'string.empty': ErrorCategoryMessage.CATEGORY_EMPTY,
    'string.pattern.base': ErrorCategoryMessage.PATTERN
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCategoryMessage.CATEGORY_ID
  })
});

const categoryValidation = (service, editCategory = false) => {
  return async (req, res, next) => {
    const newCategory = req.body;
    const {error} = editCategory
      ? editCategorySchema.validate(newCategory, {abortEarly: false})
      : newCategorySchema.validate(newCategory, {abortEarly: false});

    if (error) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(error.details.map((err) => err.message).join(`\n`));
    }

    const categoryByName = await service.findByCategoryName(req.body.newCategory);

    if (categoryByName && !editCategory) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(ErrorCategoryMessage.CATEGORY_EXIST);
    }

    if (categoryByName && editCategory) {
      return next();
    }

    return next();
  };
};

module.exports = categoryValidation;
