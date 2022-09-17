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

  categoryRoute.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await service.findOne(categoryId);

    const {count, articlesByCategory} = await service.findPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });
};

module.exports = setCategoryController;
