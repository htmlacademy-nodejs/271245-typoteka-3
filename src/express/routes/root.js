'use strict';

const asyncHandler = require(`express-async-handler`);
const upload = require(`../middlewares/upload.js`);
const {prepareErrors} = require(`../../utils.js`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const rootRouter = new Router();

const PUBLICATIONS_PER_PAGE = 8;
const api = getAPI();

rootRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;

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

  res.render(`welcome/main`, {articles, page, totalPages, categories, user});
}));

rootRouter.get(`/register`, (req, res) => {
  const {user} = req.session;

  res.render(`join/register`, {user});
});

rootRouter.post(`/register`, upload.single(`avatar`), asyncHandler(async (req, res) => {
  const {body, file} = req;
  const {name, surname, email, password} = req.body;
  const userData = {
    name,
    surname,
    email,
    password,
    passwordRepeated: body[`repeat-password`],
    avatar: file ? req.file.filename : ``,
  };

  try {
    await api.createUser({data: userData});
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`join/register`, {validationMessages});
  }
}));

rootRouter.get(`/login`, (req, res) => {
  const {user} = req.session;

  res.render(`join/login`, {user});
});

rootRouter.post(`/login`, asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth({email, password});

    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;

    res.render(`join/login`, {user, validationMessages});
  }
}));

rootRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});

rootRouter.get(`/search`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;
  const queryExist = typeof query !== `undefined`;

  try {
    const results = await api.search(query);
    res.render(`search/search`, {results, queryExist, user});
  } catch (err) {
    res.render(`search/search`, {results: [], queryExist, user});
  }
}));

module.exports = rootRouter;
