'use strict';

const {HttpCode} = require(`../../constans.js`);

const commentsValidation = (req, res, next) => {
  const newComment = req.body.text;

  if (!newComment) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request / Bad Comment Payload`);
  }

  return next();
};

module.exports = commentsValidation;
