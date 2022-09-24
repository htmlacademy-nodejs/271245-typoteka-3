'use strict';
// /my;

const asyncHandler = require(`express-async-handler`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const myRouter = new Router();

const api = getAPI();

myRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles();
  res.render(`admin_activity/my`, {articles, user});
}));

myRouter.get(`/comments`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles({
    comments: true,
  });
  res.render(`admin_activity/comments`, {articles, user});
}));

myRouter.get(`/categories`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const allCategories = await api.getCategories();
  res.render(`admin_activity/all-categories`, {allCategories, user});
}));

module.exports = myRouter;
