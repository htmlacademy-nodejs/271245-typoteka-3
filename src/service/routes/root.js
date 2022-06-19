'use strict';

const getMockData = require(`../lib/get-mock-data.js`);
const {Router} = require(`express`);
const postsRouter = new Router();

postsRouter.get(`/posts`, async (_req, res) => {
  try {
    let data = await getMockData();
    res.json(data);
  } catch (_err) {
    res.send([]);
  }
});

module.exports = postsRouter;
