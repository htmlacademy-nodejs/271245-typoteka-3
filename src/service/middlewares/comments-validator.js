'use strict';

const {HttpCode} = require(`../../constans.js`);

const commentKeys = [`text`];

const commentsValidation = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keysExists = commentKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request / Bad Comment Payload`);
  }

  return next();
};

module.exports = commentsValidation;
