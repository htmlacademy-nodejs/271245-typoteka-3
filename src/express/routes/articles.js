'use strict';
// /articles;

const asyncHandler = require(`express-async-handler`);
const upload = require(`../middlewares/upload.js`);
const {HttpCode} = require(`../../constants.js`);
const {ensureArray, prepareErrors} = require(`../../utils.js`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const articlesRouter = new Router();

const PUBLICATIONS_PER_PAGE = 8;

const api = getAPI();

articlesRouter.get(`/add`, upload.single(`article_img_upload`), asyncHandler(async (_req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`articles/post`, {categories});
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
}));

articlesRouter.post(`/add`, upload.single(`article_img_upload`), asyncHandler(async (req, res) => {
  const {title, announcement, category} = req.body;
  const articleData = {
    picture: req?.file?.filename ?? null,
    title,
    announcement,
    mainText: req.body[`full-text`],
    categories: ensureArray(category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();
    res.render(`articles/post`, {categories, validationMessages});
  }
}));

articlesRouter.post(`/edit/:articleId`, upload.single(`article_img_upload`), asyncHandler(async (req, res) => {
  const {title, announcement, category} = req.body;
  const {articleId} = req.params;
  const articleData = {
    picture: req?.file?.filename ?? req.body[`photo`],
    title,
    announcement,
    mainText: req.body[`full-text`],
    categories: ensureArray(category),
  };

  try {
    await api.editArticle({articleId, data: articleData});
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
    res.render(`articles/post`, {article, validationMessages});
  }
}));

articlesRouter.get(`/:articleId`, asyncHandler(async (req, res) => {
  const {articleId} = req.params;
  const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
  res.render(`articles/post-detail`, {article});
}));

articlesRouter.get(`/edit/:articleId`, asyncHandler(async (req, res) => {
  try {
    const {articleId} = req.params;
    const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
    res.render(`articles/post`, {article});
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
}));

articlesRouter.get(`/category/:categoryId`, asyncHandler(async (req, res) => {
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
  });
}));

articlesRouter.post(`/:articleId/comments`, asyncHandler(async (req, res) => {
  const {articleId} = req.params;
  const {message} = req.body;

  const commentData = {
    text: message
  };

  try {
    await api.createComment({articleId, data: commentData});
    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const article = await api.getArticle({publicationId: articleId, needCategoriesCount: true});
    res.render(`articles/post-detail`, {article, validationMessages});
  }
}));

module.exports = articlesRouter;
