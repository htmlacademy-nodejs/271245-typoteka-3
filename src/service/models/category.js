'use strict';

const {DataTypes, Model} = require(`sequelize`);

const CategoryValidation = {
  MIN_LENGTH: 5, // need 50
  MAX_LENGTH: 300,
};

class Category extends Model {}

const defineModel = (sequelize) => {
  return Category.init({
    title: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(CategoryValidation.MAX_LENGTH),
      allowNull: false,
      validate: {
        len: [CategoryValidation.MIN_LENGTH, CategoryValidation.MAX_LENGTH],
      },
    },
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`,
    timestamps: true,
  });
};

module.exports = defineModel;
