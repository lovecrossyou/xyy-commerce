const { UN_CHECKED } = require('../common/cart');

module.exports = app => {
  const { INTEGER, DATE, UUID, UUIDV4, STRING } = app.Sequelize;

  const CartModel = app.model.define('cart', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      // autoIncrement: true,
    },
    // 用户id
    userId: {
      type: STRING(50),
      allowNull: false,
    },
    // 店铺id
    shopId: {
      type: STRING(50),
      allowNull: true,
    },
    // 店铺名称
    shopName: {
      type: STRING(50),
      allowNull: true,
    },
    // 数量
    quantity: {
      type: INTEGER(11),
      allowNull: true,
    },
    // 是否选择， 1已勾选， 0未勾选
    checked: {
      type: INTEGER(11),
      allowNull: true,
      defaultValue: UN_CHECKED,
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
  }, {
    timestamps: false,
    tablseName: 'cart',
  }, {
    indexes: [
      { fields: [ 'userId' ] },
    ],
  }, {
    classMethods: {
      associate() {
        CartModel.belongsTo(app.model.ProductModel, { foreignKey: 'productId' });
      },
    },
  });
  // ProductModel.belongsTo(app.model.categoryModel)
  CartModel.beforeBulkUpdate(cart => {
    cart.attributes.updateTime = new Date();
    return cart;
  });

  return CartModel;
};
