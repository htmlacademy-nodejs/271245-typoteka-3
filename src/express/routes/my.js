'use strict';
// /my;

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (_req, res) => {
  res.render(`admin_activity/my`);
});

myRouter.get(`/comments`, (_req, res) => {
  res.render(`admin_activity/comments`);
});
myRouter.get(`/categories`, (_req, res) => {
  res.render(`admin_activity/all-categories`);
});

module.exports = myRouter;
