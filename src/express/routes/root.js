'use strict';

const asyncHandler = require(`express-async-handler`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const rootRouter = new Router();

const PUBLICATIONS_PER_PAGE = 8;
const api = getAPI();

rootRouter.get(`/`, asyncHandler(async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = PUBLICATIONS_PER_PAGE;

  const offset = (page - 1) * PUBLICATIONS_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / PUBLICATIONS_PER_PAGE);

  res.render(`welcome/main`, {articles, page, totalPages, categories});
}));

rootRouter.get(`/register`, (_req, res) => {
  res.render(`join/register`);
});

rootRouter.get(`/login`, (_req, res) => {
  res.render(`join/login`);
});

rootRouter.get(`/search`, asyncHandler(async (req, res) => {
  const {query} = req.query;
  const queryExist = typeof query !== `undefined`;

  try {
    const results = await api.search(query);
    res.render(`search/search`, {results, queryExist});
  } catch (err) {
    res.render(`search/search`, {results: [], queryExist});
  }
}));

module.exports = rootRouter;
