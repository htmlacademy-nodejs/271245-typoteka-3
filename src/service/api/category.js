'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants.js`);
const commentsValidation = require(`../middlewares/category-validator.js`);

const setCategoryController = (app, categoryService) => {
  const categoryRoute = new Router();

  app.use(`/category`, categoryRoute);

  categoryRoute.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);

    return res.status(HttpCode.OK)
      .json(categories);
  });

  categoryRoute.post(`/`, commentsValidation(categoryService), async (req, res) => {
    const {newCategory} = req.body;

    const categories = await categoryService.findAll();

    return res.status(HttpCode.OK)
      .json(categories);
  });

  categoryRoute.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await categoryService.findOne(categoryId);

    const {count, articlesByCategory} = await categoryService.findPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });
};

module.exports = setCategoryController;
