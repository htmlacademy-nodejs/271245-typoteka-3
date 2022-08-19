'use strict';
// /articles;

const asyncHandler = require(`express-async-handler`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {HttpCode} = require(`../../constans.js`);
const {ensureArray} = require(`../../utils.js`);
const {getAPI} = require(`../api.js`);
const {Router} = require(`express`);
const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const api = getAPI();
const upload = multer({storage});

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
    // eslint-disable-next-line new-cap
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
    res.redirect(`back`);
  }
}));

articlesRouter.get(`/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`articles/post-detail`, {article});
}));

articlesRouter.get(`/edit/:id`, asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const article = await api.getArticle(id);
    res.render(`articles/post`, {article});
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
}));

articlesRouter.get(`/category/:id`, (_req, res) => {
  res.render(`articles/articles-by-category`);
});

module.exports = articlesRouter;
