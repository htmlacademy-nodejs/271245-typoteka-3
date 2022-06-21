'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);
const articleValidation = require(`../middlewares/article-validation.js`);
const articleAvailability = require(`../middlewares/article-availability.js`);

const articlesRoute = new Router();

const setArticlesController = (app, service) => {
  app.use(`/articles`, articlesRoute);

  articlesRoute.get(`/`, async (_req, res) => {
    const allArticles = await service.findAll();

    return res.status(HttpCode.OK)
      .json(allArticles);
  });

  articlesRoute.post(`/`, [articleValidation], async (req, res) => {
    const newArticle = await service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(newArticle);
  });

  articlesRoute.get(`/:articleId`, [articleAvailability(service)], async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await service.findOne(articleId);

    return res.status(HttpCode.OK)
      .json(pickedArticle);
  });

  articlesRoute.put(`/:articleId`, [articleAvailability(service), articleValidation], async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await service.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(pickedArticle);
  });

  articlesRoute.delete(`/:articleId`, [articleAvailability(service)], async (req, res) => {
    const articleId = req.params.articleId;
    const deletedArticle = await service.drop(articleId);

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });
};

module.exports = setArticlesController;
