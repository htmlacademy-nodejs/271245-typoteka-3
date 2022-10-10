'use strict';

const express = require(`express`);
const http = require(`http`);
const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const path = require(`path`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const rootRoutes = require(`./routes/root`);
const {HttpCode} = require(`../constants.js`);
const {blue, red} = require(`chalk`);
const socket = require(`../service/lib/socket.js`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_DIR = `templates`;
const port = 8080;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();
const server = http.createServer(app);
const socketio = socket(server);
app.locals.socketio = socketio;

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 3600000,
  checkExpirationInterval: 60000
});
sequelize.sync({force: false});

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, rootRoutes);

app.use(`/my`, myRoutes);

app.use(`/articles`, articlesRoutes);

app.use((req, res) => {
  const {user} = req.session;
  res.status(HttpCode.NOT_FOUND).render(`errors/404`, {user});
});

app.use((_err, req, res, _next) => {
  const {user} = req.session;
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`, {user});
});

try {
  server.listen(port, (err) => {
    if (err) {
      return console.log(red(`An error has occurred: ${err.message}`));
    }

    return console.log(blue(`Listening to connections on ${port}`));
  }, () => {
    console.log(blue(`ФРОНТ-Сервер создан, порт: ${port}`));
  });
} catch (err) {
  console.log(red(`An error occured: ${err.message}`));
}

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);
