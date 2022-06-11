'use strict';

const {Router} = require(`express`);
const rootRouter = new Router();

rootRouter.get(`/`, (_req, res) => {
  res.render(`welcome/main`);
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
