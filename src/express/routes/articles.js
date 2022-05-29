'use strict';

const {Router} = require(`express`);
const newRouter = new Router();

newRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
newRouter.get(`/:id`, (req, res) => res.send(`/articles/${req.params.id}`));
newRouter.get(`/edit/:id`, (req, res) => res.send(`/articles//edit/${req.params.id}`));
newRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/${req.params.id}`));

module.exports = newRouter;
