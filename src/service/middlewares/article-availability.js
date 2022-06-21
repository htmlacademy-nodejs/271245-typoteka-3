'use strict';

const {HttpCode} = require(`../../constans.js`);

const articleAvailability = (service) => {
  return async (req, res, next) => {
    const articleId = req.params.articleId;
    const pickedArticle = await service.findOne(articleId);

    if (!pickedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`${articleId} - Not found`);
    }

    return next();
  };
};

module.exports = articleAvailability;
