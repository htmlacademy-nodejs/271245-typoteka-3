'use strict';
// /articles;

const {HttpCode} = require(`../../constans.js`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const articlesRouter = new Router();

const api = getAPI();

articlesRouter.get(`/add`, (_req, res) => {
  res.render(`articles/post`);
});

articlesRouter.get(`/:id`, (_req, res) => {
  res.render(`articles/post-detail`);
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  // TODO где правильнее обрабатывать?
  try {
    const {id} = req.params;
    const article = await api.getArticle(id);
    res.render(`articles/post`, {article});
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

articlesRouter.get(`/category/:id`, (_req, res) => {
  res.render(`articles/articles-by-category`);
});

module.exports = articlesRouter;
