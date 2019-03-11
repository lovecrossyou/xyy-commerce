
module.exports = app => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4, DECIMAL, BOOLEAN } = app.Sequelize;

  const WaterQualityItemModel = app.model.define('waterQualityItem', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    categoryId: {
      type: INTEGER,
      allowNull: false,
    },
    name: {
      type: STRING(50),
      allowNull: false,
      unique: true,
    },
    desc: {
      type: STRING(50),
      allowNull: false,
    },
    // 是否属于基础项
    basic: {
      type: BOOLEAN,
      allowNull: true,
    },
    // 价格，保留两位小数
    price: {
      type: DECIMAL(20, 2),
      allowNull: false,
    },
    quantity: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 1,
    },
  }
  );
  return WaterQualityItemModel;
};
