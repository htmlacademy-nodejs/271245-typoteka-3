'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize.js`);
const defineAllModel = require(`../models`);
const setCategoryController = require(`../api/category.js`);
const setArticlesController = require(`../api/articles.js`);
const setSearchController = require(`../api/search.js`);
const setUserController = require(`../api/user.js`);

const {
  CategoryService,
  ArticlesService,
  CommentsService,
  SearchService,
  UserService,
} = require(`../data-service`);

const app = new Router();
defineAllModel(sequelize);

(() => {
  setCategoryController(app, new CategoryService(sequelize));
  setArticlesController(app, new ArticlesService(sequelize), new CommentsService(sequelize));
  setSearchController(app, new SearchService(sequelize));
  setUserController(app, new UserService(sequelize));
})();

module.exports = app;
