const { ROLE_CUSTOMER } = require('../common/role');

module.exports = app => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4 } = app.Sequelize;

  const BannerModel = app.model.define('banners', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      // autoIncrement: true,
    },
    image_path: {
      type: STRING(50),
      allowNull: false,
    },
    link_path: {
      type: STRING(50),
      allowNull: true,
    },
    title: {
      type: STRING(20),
      allowNull: false,
    },
    type: {
      type: STRING(10),
      allowNull: true,
      defaultValue: ROLE_CUSTOMER,
    },
    extra: {
      type: STRING(50),
      allowNull: true,
    },
    createTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updateTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });

  BannerModel.beforeBulkUpdate(banner => {
    banner.attributes.updateTime = new Date();
    return banner;
  });

  return BannerModel;
};
