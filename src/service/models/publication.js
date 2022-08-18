'use strict';

const {DataTypes, Model} = require(`sequelize`);

const MAIN_TEXT_MAX_LENGTH = 10000; // need 1000
const IMG_TYPE = [`.png`, `.jpeg`, `.jpg`];
const AnnouncementValidation = {
  MIN_LENGTH: 3, // need 30
  MAX_LENGTH: 2500, // need 250
};
const TitleValidation = {
  MIN_LENGTH: 3, // need 30
  MAX_LENGTH: 2500, // need 250
};

class Publication extends Model {}

const defineModel = (sequelize) => {
  return Publication.init({
    title: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(TitleValidation.MAX_LENGTH),
      allowNull: false,
      validate: {
        len: [TitleValidation.MIN_LENGTH, TitleValidation.MAX_LENGTH],
      },
    },
    picture: {
      type: DataTypes.STRING,
      validate: {
        checkPictureFormat(imgUrl) {
          const isCorrectType = (imgUrl.length >= 1) && (IMG_TYPE.some((imgType) => imgUrl.endsWith(imgType)));
          if (!isCorrectType) {
            throw new Error(`Wrong img format!`);
          }
        }
      },
    },
    announcement: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(AnnouncementValidation.MAX_LENGTH),
      allowNull: false,
      validate: {
        len: [AnnouncementValidation.MIN_LENGTH, AnnouncementValidation.MAX_LENGTH],
      },
    },
    mainText: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(MAIN_TEXT_MAX_LENGTH),
    },
  }, {
    sequelize,
    modelName: `Publication`,
    tableName: `publications`,
    timestamps: true,
  });
};

module.exports = defineModel;
