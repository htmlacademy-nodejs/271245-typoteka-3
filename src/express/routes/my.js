'use strict';
// /my;

const asyncHandler = require(`express-async-handler`);
const csrf = require(`csurf`);
const auth = require(`../middlewares/auth.js`);
const admin = require(`../middlewares/admin.js`);
const {prepareErrors} = require(`../../utils.js`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const myRouter = new Router();
const csrfProtection = csrf();

const api = getAPI();

myRouter.get(`/`, auth, admin, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles();
  res.render(`admin_activity/my`, {articles, user});
}));

myRouter.get(`/comments`, auth, admin, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles({
    comments: true,
  });
  res.render(`admin_activity/comments`, {articles, user});
}));

myRouter.get(`/categories`, auth, admin, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const allCategories = await api.getCategories();
  res.render(`admin_activity/all-categories`, {allCategories, user, csrfToken: req.csrfToken()});
}));

myRouter.post(`/add/category`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const newCategory = req.body[`add-category`];

  try {
    await api.createCategory({newCategory});
    res.redirect(`/my/categories`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const allCategories = await api.getCategories();
    console.log(validationMessages);
    res.render(`admin_activity/all-categories`, {allCategories, validationMessages, user, csrfToken: req.csrfToken()});
  }
}));

module.exports = myRouter;
