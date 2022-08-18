'use strict';

class CommentsService {
  constructor(sequelize) {
    this._Publication = sequelize.models.Publication;
    this._Comment = sequelize.models.Comment;
  }

  findAll(publicationId) {
    return this._Comment.findAll({
      where: {
        publicationId,
      },
      raw: true,
    });
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
