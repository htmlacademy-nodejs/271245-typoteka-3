'use strict';
// /articles;

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {HttpCode} = require(`../../constans.js`);
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

articlesRouter.get(`/add`, (_req, res) => {
  res.render(`articles/post`);
});

articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {date, title, photo, announcement} = req.body;
  const articleData = {
    picture: photo,
    createdDate: date,
    title,
    announce: announcement,
    fullText: req.body[`full-text`],
    category: [`Программирование`],
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
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
