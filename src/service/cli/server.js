'use strict';

const express = require(`express`);
const {red, green} = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constans.js`);
const routes = require(`../api`);

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

    const app = express();
    app.use(express.json());
    app.use(routes);

    app.listen(port)
      .on(`listening`, () => {
        console.info(green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(red(`Ошибка при создании сервера: ${message}`));
      });

    app.use((_req, res) => res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_TEXT));

  },
};
