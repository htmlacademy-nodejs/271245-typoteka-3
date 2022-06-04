'use strict';
// /articles;

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => {
  res.render(`articles/post`);
});

articlesRouter.get(`/:id`, (req, res) => {
  res.render(`articles/post-detail`);
});

articlesRouter.get(`/edit/:id`, (req, res) => {
  res.render(`articles/post`);
});

articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles/articles-by-category`);
});

module.exports = articlesRouter;
