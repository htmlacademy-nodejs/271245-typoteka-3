'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  SUCCESS: 200,
  NOT_FOUND: 404,
};

const USER_ARGV_INDEX = 2;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_PORT,
  ExitCode,
  HttpCode,
  USER_ARGV_INDEX,
};
