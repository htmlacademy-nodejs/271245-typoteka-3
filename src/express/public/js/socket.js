'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);
  
  let lastCommentsList = document.querySelector(`.last__list`);
  if (lastCommentsList) {
    socket.addEventListener('articleComment:create', (lastComments) => {
      lastCommentsList.innerHTML = lastComments.map((item) => {
        return `<li class="last__list-item">
                  <img class="last__list-image" src="img/${item[`users.avatar`] ? item[`users.avatar`] : `default-avatar.png`}" width="20" height="20" alt="Аватар пользователя">
                  <b class="last__list-name">${item[`users.name`]} ${item[`users.surname`]}</b><a class="last__list-link" href="/articles/${item.publicationId}">${item.text}</a>
                </li>`
      }).join(``);
    });
  }
})();
