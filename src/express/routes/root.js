'use strict';

const {Router} = require(`express`);
const rootRouter = new Router();

rootRouter.get(`/`, (req, res) => {
  res.render(`welcome/main`);
});

rootRouter.get(`/register`, (req, res) => {
  res.render(`join/register`);
});

rootRouter.get(`/login`, (req, res) => {
  res.render(`join/login`);
});

rootRouter.get(`/search`, (req, res) => {
  res.render(`search/search`);
});

module.exports = rootRouter;
