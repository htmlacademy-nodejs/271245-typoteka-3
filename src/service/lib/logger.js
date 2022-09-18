'use strict';

const pino = require(`pino`);
const pinoPretty = require(`pino-pretty`);
const {Env} = require(`../../constants.js`);

const LOG_FILE = `./logs/api.log`;
const DEFAULT_STDOUT_OUTPUT = 1;
const isProdMode = process.env.NODE_ENV === Env.PRODUCTION;
const logLevel = isProdMode ? `error` : `info`;

const pinoOptions = {
  name: `base-logger`,
  level: process.env.LOG_LEVEL || logLevel,
  mkdir: isProdMode,
  destination: isProdMode ? LOG_FILE : DEFAULT_STDOUT_OUTPUT,
};

const logger = pino(pinoPretty(pinoOptions));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
