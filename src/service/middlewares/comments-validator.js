'use strict';

const {HttpCode} = require(`../../constans.js`);

const commentsValidation = (req, res, next) => {
  const newComment = req.body.text;

  if (!newComment) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request / Bad Comment Payload`);
  }

  next();
};

module.exports = commentsValidation;
