'use strict';
// /my;

const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const myRouter = new Router();

const api = getAPI();

myRouter.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`admin_activity/my`, {articles});
});

myRouter.get(`/comments`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`admin_activity/comments`, {articles});
});
myRouter.get(`/categories`, (_req, res) => {
  res.render(`admin_activity/all-categories`);
});

module.exports = myRouter;
