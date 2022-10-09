'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);

  const formatText = (str) => {
    const TEXT_MAX_STRING = 100;
    return str.length <= TEXT_MAX_STRING ? str : `${str.substring(0, TEXT_MAX_STRING)}...`;
  }
  
  socket.addEventListener('articleComment:create', ({lastComments, mostDiscussedArticles}) => {
    let lastCommentsList = document.querySelector(`.last__list`);
    let mostDiscussedList = document.querySelector(`.hot__list`);
    if (lastCommentsList) {
      lastCommentsList.innerHTML = lastComments.map((item) => {
        return `<li class="last__list-item">
                  <img class="last__list-image" src="img/${item[`users.avatar`] ? item[`users.avatar`] : `default-avatar.png`}" width="20" height="20" alt="Аватар пользователя">
                  <b class="last__list-name">${item[`users.name`]} ${item[`users.surname`]}</b><a class="last__list-link" href="/articles/${item.publicationId}">${item.text}</a>
                </li>`
      }).join(``);
    }
    if (mostDiscussedList) {
      mostDiscussedList.innerHTML = mostDiscussedArticles.map((item) => {
        return `<li class="hot__list-item">
                  <a class="hot__list-link" href="/articles/${item.id}">
                    ${formatText(item.announcement)}
                    <sup class="hot__link-sup">${item.comments.length}</sup>
                  </a>
                </li>`
      }).join(``);
    }
  });
})();
