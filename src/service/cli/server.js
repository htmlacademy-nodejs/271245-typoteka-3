'use strict';

const http = require(`http`);
const {red} = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constans.js`);

const MIN_PORT = 1000;
const MAX_PORT = 65535;

const setPort = (port) => {
  const isCorrectPort = Number.parseInt(port, 10) > MIN_PORT && Number.parseInt(port, 10) < MAX_PORT;
  return isCorrectPort ? port : DEFAULT_PORT;
};

const getTitles = () => {
  try {
    const titleList = require(`../../../mock.json`).map((item) => item.title);
    return titleList;
  } catch (err) {
    console.error(red.bold(`Something went wrong, reason: ${err}`));
    return null;
  }
};

const setHtmlLayout = (titleList) => {
  return `<ul>${titleList.slice().map((item) => `<li>${item}</li>`)}</ul>`;
};

const server = http.createServer((req, res) => {
  const titles = getTitles();
  if (req.url === `/` && titles) {
    res.writeHead(HttpCode.SUCCESS, {'Content-Type': `text/html; charset=UTF-8`});
    res.end(setHtmlLayout(titles));
  } else {
    res.writeHead(HttpCode.NOT_FOUND, {'Content-Type': `text/html; charset=UTF-8`});
    res.end(`<section>NOT FOUND</section>`);
  }
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [userPort] = args;
    const port = setPort(userPort);
    server.listen(port);
  },
};
