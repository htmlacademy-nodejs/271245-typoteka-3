'use strict';

const {Server} = require(`socket.io`);

const socket = (server) => {
  return new Server(server, {
    cors: {
      origins: [
        `localhost:8080`,
        ...(process.env.SOCKET_CORS ? [process.env.SOCKET_CORS] : []),
      ],
      methods: [`GET`]
    }
  });
};

module.exports = socket;
