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
    const createdCategory = await categoryService.create({title: newCategory});

    if (!createdCategory) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(createdCategory);
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

  categoryRoute.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    let category = await categoryService.findOne(categoryId);
    category = category.toJSON();

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    if (category.publicationCategories.length) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    const deletedCategory = await categoryService.drop(categoryId);

    return res.status(HttpCode.OK)
      .json(deletedCategory);
  });
};

module.exports = setCategoryController;
