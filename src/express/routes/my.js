'use strict';
// /my;

const asyncHandler = require(`express-async-handler`);
const csrf = require(`csurf`);
const auth = require(`../middlewares/auth.js`);
const admin = require(`../middlewares/admin.js`);
const {HttpCode} = require(`../../constants.js`);
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

  const lastComments = await api.getLastComments();

  res.render(`admin_activity/comments`, {lastComments, user});
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
    res.render(`admin_activity/all-categories`, {allCategories, validationMessages, user, csrfToken: req.csrfToken()});
  }
}));

myRouter.post(`/edit/category/:categoryId`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  const newCategory = req.body.category;

  try {
    await api.editCategory({categoryId, newCategory});
    res.redirect(`/my/categories`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const allCategories = await api.getCategories();
    res.render(`admin_activity/all-categories`, {allCategories, validationMessages, user, csrfToken: req.csrfToken()});
  }
}));

myRouter.delete(`/:categoryId`, auth, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;

  try {
    const deletedCategory = await api.removeCategory({userId: user.id, categoryId});

    res.status(HttpCode.OK).send(deletedCategory);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
}));

module.exports = myRouter;
