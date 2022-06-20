'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);

const articlesRoute = new Router();

const setArticlesController = (app, service) => {
  app.use(`/articles`, articlesRoute);

  articlesRoute.get(`/`, async (_req, res) => {
    const allArticles = await service.findAll();

    return res.status(HttpCode.OK)
      .json(allArticles);
  });

  articlesRoute.get(`/:articleId`, async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await service.findOne(articleId);

    if (!pickedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(pickedArticle);
  });

  articlesRoute.post(`/`, async (req, res) => {
    const newArticle = await service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(newArticle);
  });

  articlesRoute.put(`/:articleId`, async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await service.update(articleId, req.body);

    if (!pickedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(pickedArticle);
  });

  articlesRoute.delete(`/:articleId`, async (req, res) => {
    const articleId = req.params.articleId;
    const deletedArticle = await service.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });
};

module.exports = setArticlesController;
