'use strict';

const {Router} = require(`express`);
const newRouter = new Router();

newRouter.get(`/`, (req, res) => res.send(`/my`));
newRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));
newRouter.get(`/categories`, (req, res) => res.send(`/my/categories`));

module.exports = newRouter;
