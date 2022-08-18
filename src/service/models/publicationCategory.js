'use strict';

const {Model} = require(`sequelize`);

class PublicationCategory extends Model {}

const defineModel = (sequelize) => {
  return PublicationCategory.init({}, {
    sequelize,
    modelName: `PublicationCategory`,
    tableName: `publication_categories`,
    timestamps: false,
  });
};

module.exports = defineModel;
