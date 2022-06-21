'use strict';

const {HttpCode} = require(`../../constans.js`);

const articleKeys = [`title`, `announce`, `fullText`, `createdDate`, `category`, `comments`];

const articleValidation = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request / Bad PayLoad`);
  }

  return next();
};

module.exports = articleValidation;
