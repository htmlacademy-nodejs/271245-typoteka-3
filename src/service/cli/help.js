'use strict';

const {grey} = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    console.log(grey(`
    Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>
    Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>    формирует файл mocks.json
    `));
  },
};
