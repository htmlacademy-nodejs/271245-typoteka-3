'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans.js`);

const searchRoute = new Router();

const setSearchController = (app, searchService) => {
  app.use(`/search`, searchRoute);

  searchRoute.get(`/`, async (req, res) => {
    const query = req.query.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const articles = await searchService.findAll(query);

    const statusCode = articles.length ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(statusCode)
      .json(articles);
  });

};

module.exports = setSearchController;
