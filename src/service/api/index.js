'use strict';

const {Router} = require(`express`);
const setCategoryController = require(`../api/category.js`);
const setArticlesController = require(`../api/articles.js`);
const setSearchController = require(`../api/search.js`);
const getMockData = require(`../lib/get-mock-data.js`);
const {
  CategoryService,
  ArticlesService,
  CommentsService,
  SearchService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  setCategoryController(app, new CategoryService(mockData));
  setArticlesController(app, new ArticlesService(mockData), new CommentsService());
  setSearchController(app, new SearchService(mockData));
})();

module.exports = app;
