'use strict';

const express = require(`express`);
const http = require(`http`);
const {DEFAULT_PORT, HttpCode, API_PREFIX} = require(`../../constants.js`);
const routes = require(`../api`);
const sequelize = require(`../lib/sequelize.js`);
const {getLogger} = require(`../lib/logger`);
const {green} = require(`chalk`);
const socket = require(`../lib/socket`);

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
    const server = http.createServer(app);
    const socketio = socket(server);
    app.locals.socketio = socketio;
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

    try {
      server.listen(port, (err) => {
        if (err) {
          return logger.error(`An error has occurred: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      }, () => {
        console.log(green(`БЭК-Сервер создан, порт: ${port}`));
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
    }

  },
};
