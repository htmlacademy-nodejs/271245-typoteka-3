'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);

const categoryRoute = new Router();

const setCategoryController = (app, service) => {
  app.use(`/category`, categoryRoute);

  categoryRoute.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);

    return res.status(HttpCode.OK)
      .json(categories);
  });
};

module.exports = setCategoryController;
