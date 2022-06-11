'use strict';
// /articles;

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (_req, res) => {
  res.render(`articles/post`);
});

articlesRouter.get(`/:id`, (_req, res) => {
  res.render(`articles/post-detail`);
});

articlesRouter.get(`/edit/:id`, (_req, res) => {
  res.render(`articles/post`);
});

articlesRouter.get(`/category/:id`, (_req, res) => {
  res.render(`articles/articles-by-category`);
});

module.exports = articlesRouter;
