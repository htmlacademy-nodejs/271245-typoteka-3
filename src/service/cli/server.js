'use strict';

const express = require(`express`);
const {DEFAULT_PORT, HttpCode, API_PREFIX} = require(`../../constants.js`);
const routes = require(`../api`);
const sequelize = require(`../lib/sequelize.js`);
const {getLogger} = require(`../lib/logger`);
const {green} = require(`chalk`);

const MIN_PORT = 1000;
const MAX_PORT = 65535;

const logger = getLogger({name: `api`});
const setPort = (port) => {
  const portInt = Number.parseInt(port, 10);
  const isCorrectPort = portInt > MIN_PORT && portInt < MAX_PORT;
  return isCorrectPort ? portInt : DEFAULT_PORT;
};

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const NOT_FOUND_TEXT = `Not found`;
    const [userPort] = args;
    const port = setPort(userPort);

    const app = express();
    app.use(express.json());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use(API_PREFIX, routes);

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_TEXT);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    app.listen(port, () => {
      console.log(green(`БЭК-Сервер создан, порт: ${port}`));
    })
      .on(`listening`, () => {
        logger.info(`Listening to connections on ${port}`);
      })
      .on(`error`, (err) => {
        logger.error(`An error has occurred: ${err.message}`);
      });

  },
};
