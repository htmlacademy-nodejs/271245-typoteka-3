'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constans.js`);

class CommentsService {
  constructor() {}

  findAll(article) {
    return article.comments;
  }

  create(article, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    article.comments.push(newComment);
    return newComment;
  }

  drop(article, commentID) {
    const commentToDelete = article.comments.find((item) => item.id === commentID);

    if (!commentToDelete) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentID);

    return commentToDelete;
  }
}

module.exports = CommentsService;
