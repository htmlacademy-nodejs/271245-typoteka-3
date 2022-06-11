'use strict';

const express = require(`express`);

const app = express();
app.use(express.json());

const fs = require(`fs`).promises;
const {green} = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constans.js`);

const FILENAME = `mock.json`;
const MIN_PORT = 1000;
const MAX_PORT = 65535;

const setPort = (port) => {
  const portInt = Number.parseInt(port, 10);
  const isCorrectPort = portInt > MIN_PORT && portInt < MAX_PORT;
  return isCorrectPort ? portInt : DEFAULT_PORT;
};

module.exports = {
  name: `--server`,
  async run(args) {
    const NOT_FOUND_TEXT = `Not found`;
    const [userPort] = args;
    const port = setPort(userPort);

    app.listen(port, () => {
      console.log(green(`CLI-Сервер создан, порт: ${port}`));
    });

    app.get(`/posts`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (_err) {
        res.send([]);
      }
    });

    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(NOT_FOUND_TEXT)
    );

  },
};
