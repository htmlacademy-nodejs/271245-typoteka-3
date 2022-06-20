'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);

const categoryRoute = new Router();

const setCategoryController = (app, service) => {
  app.use(`/category`, categoryRoute);

  categoryRoute.get(`/`, async (_req, res) => {
    const categories = await service.findAll();

    return res.status(HttpCode.OK)
      .json(categories);
  });
};

module.exports = setCategoryController;
