'use strict';

const {DataTypes, Model} = require(`sequelize`);

const CommentValidation = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 1000,
};

class Comment extends Model {}

const defineModel = (sequelize) => {
  return Comment.init({
    mainText: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [CommentValidation.MIN_LENGTH, CommentValidation.MAX_LENGTH],
      },
    },
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`,
    timestamps: true,
  });
};

module.exports = defineModel;
