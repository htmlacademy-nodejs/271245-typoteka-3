'use strict';

const {HttpCode} = require(`../../constants.js`);

const articleAvailability = (service) => {
  return async (req, res, next) => {
    const articleId = req.params.articleId;
    const pickedArticle = await service.findOne({publicationId: articleId});

    if (Object.keys(pickedArticle).length === 0) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`${articleId} - Not found`);
    }

    return next();
  };
};

module.exports = articleAvailability;
