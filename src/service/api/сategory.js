'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);

const categoryRoute = new Router();

module.exports = (app, service) => {
  app.use(`/category`, categoryRoute);

  categoryRoute.get(`/`, async (_req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });
};
