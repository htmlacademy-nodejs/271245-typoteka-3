'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

const MAX_ID_LENGTH = 6;

const LAST_COMMENTS_QUANTITY = 4;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const USER_ARGV_INDEX = 2;

const API_PREFIX = `/api/v1`;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_PORT,
  ExitCode,
  HttpCode,
  HttpMethod,
  Env,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  LAST_COMMENTS_QUANTITY,
  API_PREFIX,
};
