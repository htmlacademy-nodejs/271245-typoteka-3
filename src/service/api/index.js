'use strict';

const {Router} = require(`express`);
const setCategoryController = require(`../api/сategory.js`);
const setArticlesController = require(`../api/articles.js`);
const getMockData = require(`../lib/get-mock-data.js`);
const {
  CategoryService,
  ArticlesService,
  CommentsService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  setCategoryController(app, new CategoryService(mockData));
  setArticlesController(app, new ArticlesService(mockData), new CommentsService());
})();

module.exports = app;
