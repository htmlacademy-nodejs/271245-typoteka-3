'use strict';

const defineCategoryModel = require(`./category.js`);
const definePublicationsModel = require(`./publication.js`);
const defineCommentModel = require(`./comment.js`);
const definePublicationCategoryModel = require(`./publicationCategory.js`);
const Aliase = require(`./aliase.js`);

const defineAllModel = (sequelize) => {
  const Category = defineCategoryModel(sequelize);
  const Publication = definePublicationsModel(sequelize);
  const Comment = defineCommentModel(sequelize);
  const PublicationCategory = definePublicationCategoryModel(sequelize);

  Publication.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `publicationId`, onDelete: `cascade`});
  Comment.belongsTo(Publication, {foreignKey: `publicationId`});

  Publication.belongsToMany(Category, {through: PublicationCategory, as: Aliase.CATEGORIES, foreignKey: `publicationId`});
  Category.belongsToMany(Publication, {through: PublicationCategory, as: Aliase.PUBLICATIONS, foreignKey: `categoryId`});
  Category.hasMany(PublicationCategory, {as: Aliase.PUBLICATION_CATEGORIES, foreignKey: `categoryId`}); // !!!!!!!!!!!!!!!!??????????????

  return {
    Category,
    Publication,
    Comment,
    PublicationCategory,
  };
};

module.exports = defineAllModel;

// Прочие изменения касаются категорий
