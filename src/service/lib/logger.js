'use strict';

const pino = require(`pino`);
const pinoPretty = require(`pino-pretty`);
const {Env} = require(`../../constans.js`);

const LOG_FILE = `./logs/api.log`;
const DEFAULT_STDOUT_OUTPUT = 1;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const logLevel = isDevMode ? `error` : `info`;

const pinoOptions = {
  name: `base-logger`,
  level: process.env.LOG_LEVEL || logLevel,
  mkdir: isDevMode,
  destination: isDevMode ? LOG_FILE : DEFAULT_STDOUT_OUTPUT,
};

const logger = isDevMode ? pino(pinoPretty(pinoOptions)) : pino(pinoOptions);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
