'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

const MAX_ID_LENGTH = 6;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const USER_ARGV_INDEX = 2;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_PORT,
  ExitCode,
  HttpCode,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
};
