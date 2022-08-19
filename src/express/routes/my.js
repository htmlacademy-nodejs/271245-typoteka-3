'use strict';
// /my;

const asyncHandler = require(`express-async-handler`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const myRouter = new Router();

const api = getAPI();

myRouter.get(`/`, asyncHandler(async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`admin_activity/my`, {articles});
}));

myRouter.get(`/comments`, asyncHandler(async (_req, res) => {
  const articles = await api.getArticles({
    comments: true,
  });
  res.render(`admin_activity/comments`, {articles});
}));

myRouter.get(`/categories`, asyncHandler(async (req, res) => {
  const allCategories = await api.getCategories();
  res.render(`admin_activity/all-categories`, {allCategories});
}));

module.exports = myRouter;
