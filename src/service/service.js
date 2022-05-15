'use strict';

const {Cli} = require(`./cli`);
const {DEFAULT_COMMAND, ExitCode, USER_ARGV_INDEX} = require(`../constans.js`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));
