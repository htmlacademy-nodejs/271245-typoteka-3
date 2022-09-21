'use strict';

const defineAllModel = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categoryList, publications, users}) => {
  const {Category, Publication, User} = defineAllModel(sequelize);
  await sequelize.sync({force: true});

  const categoryDBValues = categoryList.map((item) => ({title: item}));
  const categoryModels = await Category.bulkCreate(categoryDBValues);

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  const userModels = await User.bulkCreate(users, {include: [Aliase.PUBLICATIONS, Aliase.COMMENTS]});
  console.log(userModels);

  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  publications.forEach((publication) => {
    publication.userId = userIdByEmail[publication.user];
    publication.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const publicationPromises = publications.map(async (publication) => {
    const publicationModel = await Publication.create(publication, {include: [Aliase.COMMENTS]});
    await publicationModel.addCategories(publication.category.map((title) => categoryIdByName[title]));
  });
  await Promise.all(publicationPromises);
};
