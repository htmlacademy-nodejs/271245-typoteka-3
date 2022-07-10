'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);
const articleValidation = require(`../middlewares/article-validation.js`);
const articleAvailability = require(`../middlewares/article-availability.js`);
const commentsValidation = require(`../middlewares/comments-validator.js`);

const articlesRoute = new Router();

const setArticlesController = (app, articleService, commentsService) => {
  app.use(`/articles`, articlesRoute);

  articlesRoute.get(`/`, async (_req, res) => {
    const allArticles = await articleService.findAll();

    return res.status(HttpCode.OK)
      .json(allArticles);
  });

  articlesRoute.post(`/`, [articleValidation], async (req, res) => {
    const newArticle = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(newArticle);
  });

  articlesRoute.get(`/:articleId`, [articleAvailability(articleService)], async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await articleService.findOne(articleId);

    return res.status(HttpCode.OK)
      .json(pickedArticle);
  });

  articlesRoute.put(`/:articleId`, [articleAvailability(articleService), articleValidation], async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(pickedArticle);
  });

  articlesRoute.delete(`/:articleId`, [articleAvailability(articleService)], async (req, res) => {
    const articleId = req.params.articleId;
    const deletedArticle = await articleService.drop(articleId);

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  articlesRoute.get(`/:articleId/comments`, [articleAvailability(articleService)], async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await articleService.findOne(articleId);
    const allComments = await commentsService.findAll(pickedArticle);

    return res.status(HttpCode.OK)
      .json(allComments);
  });

  articlesRoute.post(`/:articleId/comments`, [articleAvailability(articleService), commentsValidation], async (req, res) => {
    const articleId = req.params.articleId;
    const pickedArticle = await articleService.findOne(articleId);
    const newComment = await commentsService.create(pickedArticle, req.body);

    return res.status(HttpCode.CREATED)
      .json(newComment);
  });

  articlesRoute.delete(`/:articleId/comments/:commentId`, [articleAvailability(articleService)], async (req, res) => {
    const {articleId, commentId} = req.params;
    const pickedArticle = await articleService.findOne(articleId);
    const deletedComment = await commentsService.drop(pickedArticle, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

};

module.exports = setArticlesController;
