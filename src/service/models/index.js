'use strict';

const defineCategoryModel = require(`./category.js`);
const definePublicationsModel = require(`./publication.js`);
const defineCommentModel = require(`./comment.js`);
const definePublicationCategoryModel = require(`./publicationCategory.js`);
const defineUserModel = require(`./user.js`);
const Aliase = require(`./aliase.js`);

const defineAllModel = (sequelize) => {
  const Category = defineCategoryModel(sequelize);
  const Publication = definePublicationsModel(sequelize);
  const Comment = defineCommentModel(sequelize);
  const PublicationCategory = definePublicationCategoryModel(sequelize);
  const User = defineUserModel(sequelize);

  Publication.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `publicationId`, onDelete: `cascade`});
  Comment.belongsTo(Publication, {foreignKey: `publicationId`});

  Publication.belongsToMany(Category, {through: PublicationCategory, as: Aliase.CATEGORIES, foreignKey: `publicationId`});
  Category.belongsToMany(Publication, {through: PublicationCategory, as: Aliase.PUBLICATIONS, foreignKey: `categoryId`});
  Category.hasMany(PublicationCategory, {as: Aliase.PUBLICATION_CATEGORIES, foreignKey: `categoryId`});

  User.hasMany(Publication, {as: Aliase.PUBLICATIONS, foreignKey: `userId`});
  Publication.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

  return {
    Category,
    Publication,
    Comment,
    PublicationCategory,
    User,
  };
};

module.exports = defineAllModel;

