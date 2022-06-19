'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);

const articlesRoute = new Router();

const setArticlesController = (app, service) => {
  app.use(`/articles`, articlesRoute);

  articlesRoute.get(`/`, async (_req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });
};

module.exports = setArticlesController;
