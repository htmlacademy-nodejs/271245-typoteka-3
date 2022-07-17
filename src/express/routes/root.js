'use strict';

const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const rootRouter = new Router();

const api = getAPI();

rootRouter.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`welcome/main`, {articles});
});

rootRouter.get(`/register`, (_req, res) => {
  res.render(`join/register`);
});

rootRouter.get(`/login`, (_req, res) => {
  res.render(`join/login`);
});

rootRouter.get(`/search`, (_req, res) => {
  res.render(`search/search`);
});

module.exports = rootRouter;
