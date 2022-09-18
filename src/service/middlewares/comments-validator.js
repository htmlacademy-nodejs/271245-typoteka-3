'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants.js`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT
  })
});

const commentsValidation = (req, res, next) => {
  const newComment = req.body;
  const {error} = schema.validate(newComment, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

module.exports = commentsValidation;
