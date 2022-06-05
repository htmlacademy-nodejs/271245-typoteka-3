'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const {red, green} = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constans.js`);

const FILENAME = `mock.json`;
const MIN_PORT = 1000;
const MAX_PORT = 65535;

const setPort = (port) => {
  const portInt = Number.parseInt(port, 10);
  const isCorrectPort = portInt > MIN_PORT && portInt < MAX_PORT;
  return isCorrectPort ? portInt : DEFAULT_PORT;
};

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>Test!</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = `<ul>${mocks.map((post) => `<li>${post.title}</li>`).join(``)}</ul>`;
        sendResponse(res, HttpCode.OK, message);
      } catch (err) {
        console.log(11);
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [userPort] = args;
    const port = setPort(userPort);
    http
      .createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.info(green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(red(`Ошибка при создании сервера: ${message}`));
      });
  },
};
