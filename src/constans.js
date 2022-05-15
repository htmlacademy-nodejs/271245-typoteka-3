'use strict';

const DEFAULT_COMMAND = `--help`;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const USER_ARGV_INDEX = 2;

module.exports = {
  DEFAULT_COMMAND,
  ExitCode,
  USER_ARGV_INDEX,
};
