'use strict';
// /my;

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => {
  res.render(`admin_activity/my`);
});

myRouter.get(`/comments`, (req, res) => {
  res.render(`admin_activity/comments`);
});
myRouter.get(`/categories`, (req, res) => {
  res.render(`admin_activity/all-categories`);
});

module.exports = myRouter;
