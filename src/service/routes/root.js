'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;
const postsRouter = new Router();

const FILENAME = `mock.json`;

postsRouter.get(`/posts`, async (_req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
});

module.exports = postsRouter;
