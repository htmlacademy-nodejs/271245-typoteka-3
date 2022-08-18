'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);
const articleValidation = require(`../middlewares/article-validation.js`);
const articleAvailability = require(`../middlewares/article-availability.js`);
const commentsValidation = require(`../middlewares/comments-validator.js`);

const setArticlesController = (app, articleService, commentsService) => {
  const articlesRoute = new Router();

  app.use(`/articles`, articlesRoute);

  articlesRoute.get(`/`, async (req, res) => {
    const needCommentsFlag = req.query.comments;
    const allArticles = await articleService.findAll(needCommentsFlag);

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

    if (!deletedArticle) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  articlesRoute.get(`/:articleId/comments`, [articleAvailability(articleService)], async (req, res) => {
    const articleId = req.params.articleId;
    const allComments = await commentsService.findAll(articleId);

    return res.status(HttpCode.OK)
      .json(allComments);
  });

  articlesRoute.post(`/:articleId/comments`, [articleAvailability(articleService), commentsValidation], async (req, res) => {
    const articleId = req.params.articleId;
    const newComment = await commentsService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(newComment);
  });

  articlesRoute.delete(`/:articleId/comments/:commentId`, [articleAvailability(articleService)], async (req, res) => {
    const {articleId, commentId} = req.params;
    const existingComment = await commentsService.findOne(commentId, articleId);

    if (!existingComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedComment = await commentsService.drop(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

};

module.exports = setArticlesController;
