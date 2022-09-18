'use strict';

const express = require(`express`);
const path = require(`path`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const rootRoutes = require(`./routes/root`);
const {HttpCode} = require(`../constants.js`);
const {green} = require(`chalk`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_DIR = `templates`;
const port = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, rootRoutes);

app.use(`/my`, myRoutes);

app.use(`/articles`, articlesRoutes);

app.use((_req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/404`));

app.listen(port, () => {
  console.log(green(`Сервер создан, порт: ${port}`));
});

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);
