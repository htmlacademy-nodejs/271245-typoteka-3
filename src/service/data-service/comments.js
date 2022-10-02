'use strict';

const Aliase = require(`../models/aliase.js`);

class CommentsService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  findAll(publicationId) {
    return this._Comment.findAll({
      where: {
        publicationId,
      },
      raw: true,
    });
  }

  async findLast(count) {
    let lastComments = await this._Comment.findAll({
      include: [{
        model: this._User,
        as: Aliase.USERS,
        attributes: [`name`, `surname`, `avatar`]
      }],
      order: [
        [`createdAt`, `DESC`]
      ],
      raw: true,
    });
    return count ? lastComments.splice(0, count) : lastComments;
  }

  async findOne(commentId, publicationId) {
    return await this._Comment.findOne({
      where: {
        id: commentId,
        publicationId
      }
    });
  }

  create(publicationId, comment) {
    return this._Comment.create({
      publicationId,
      ...comment,
    });
  }

  drop(commentId) {
    const deletedRow = this._Comment.destroy({
      where: {
        id: commentId,
      }
    });
    return Boolean(deletedRow);
  }
}

module.exports = CommentsService;
