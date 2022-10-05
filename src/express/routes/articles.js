'use strict';
// /articles;

const asyncHandler = require(`express-async-handler`);
const csrf = require(`csurf`);
const upload = require(`../middlewares/upload.js`);
const auth = require(`../middlewares/auth.js`);
const admin = require(`../middlewares/admin.js`);
const {HttpCode} = require(`../../constants.js`);
const {ensureArray, prepareErrors} = require(`../../utils.js`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const articlesRouter = new Router();
const csrfProtection = csrf();

const PUBLICATIONS_PER_PAGE = 8;

const api = getAPI();

articlesRouter.get(`/add`, auth, admin, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;

  try {
    const categories = await api.getCategories();
    res.render(`articles/post`, {categories, user, csrfToken: req.csrfToken()});
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
}));

articlesRouter.post(`/add`, upload.single(`article_img_upload`), csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {title, announcement, category} = req.body;
  const articleData = {
    picture: req?.file?.filename ?? null,
    title,
    announcement,
    mainText: req.body[`full-text`],
    categories: ensureArray(category),
    userId: user.id,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();
    res.render(`articles/post`, {categories, validationMessages, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.post(`/edit/:articleId`, upload.single(`article_img_upload`), csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {title, announcement, category} = req.body;
  const {articleId} = req.params;
  const articleData = {
    picture: req?.file?.filename ?? req.body[`photo`],
    title,
    announcement,
    mainText: req.body[`full-text`],
    categories: ensureArray(category),
    userId: user.id,
  };

  try {
    await api.editArticle({articleId, data: articleData});
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
    res.render(`articles/post`, {article, user, validationMessages, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.get(`/:articleId`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const {articleId} = req.params;
  const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
  res.render(`articles/post-detail`, {article, user, csrfToken: req.csrfToken()});
}));

articlesRouter.get(`/edit/:articleId`, auth, admin, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;

  try {
    const {articleId} = req.params;
    const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
    res.render(`articles/post`, {article, user, csrfToken: req.csrfToken()});
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
}));

articlesRouter.get(`/category/:categoryId`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  const {categoryId} = req.params;
  let {page = 1} = req.query;
  page = +page;

  const limit = PUBLICATIONS_PER_PAGE;
  const offset = (page - 1) * PUBLICATIONS_PER_PAGE;

  const [categories, {category, count, articlesByCategory}] = await Promise.all([
    api.getCategories(true),
    api.getCategory({categoryId, limit, offset})
  ]);

  const totalPages = Math.ceil(count / PUBLICATIONS_PER_PAGE);

  const publicationsData = {
    category,
    currentPublications: articlesByCategory
  };

  res.render(`articles/articles-by-category`, {
    categories,
    count,
    publicationsData,
    page,
    totalPages,
    user,
  });
}));

articlesRouter.post(`/:articleId/comments`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {articleId} = req.params;
  const {message} = req.body;

  const commentData = {
    text: message,
    userId: user.id,
  };

  try {
    await api.createComment({articleId, data: commentData});
    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
    res.render(`articles/post-detail`, {article, validationMessages, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.delete(`/:articleId/comments/:commentId`, auth, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {articleId, commentId} = req.params;

  try {
    const comment = await api.removeComment({articleId, userId: user.id, commentId});

    res.status(HttpCode.OK).send(comment);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
}));

module.exports = articlesRouter;
