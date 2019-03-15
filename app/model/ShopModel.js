module.exports = app => {
  const { DATE, STRING, UUID, UUIDV4, DECIMAL } = app.Sequelize;


  //   activities: [{icon_name: "减", name: "满减优惠", description: "满30减5，满60减8"}]
  // 0: {icon_name: "减", name: "满减优惠", description: "满30减5，满60减8"}


  // image_path: ""
  // latitude: 39.92843
  // longitude: 116.35073
  // name: "小猪的店"
  // promotion_info: "铺标语铺标语铺标语铺标语"
  // startTime: "05:30"
  // phone: 18610824157


  const ShopModel = app.model.define('shop', {
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
    createTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    // 详细地址
    address: {
      type: STRING(50),
      allowNull: false,
    },
    category: {
      type: STRING(20),
      allowNull: false,
    },
    // 营业执照
    business_license_image: {
      type: STRING(20),
      allowNull: false,
    },
    // 餐饮服务许可证
    catering_service_license_image: {
      type: STRING(20),
      allowNull: false,
    },
    float_delivery_fee: {
      type: DECIMAL(20, 2),
      allowNull: true,
      defaultValue: 0,
    },
    float_minimum_order_amount: {
      type: DECIMAL(20, 2),
      allowNull: true,
      defaultValue: 0,
    },
    // 店铺头像
    image_path: {
      type: STRING(50),
      allowNull: false,
    },
    // 经纬度
    latitude: {
      type: STRING(50),
      allowNull: false,
    },
    // 经纬度
    longitude: {
      type: STRING(50),
      allowNull: false,
    },
    // 店铺标语
    promotion_info: {
      type: STRING(50),
      allowNull: true,
    },
    // 营业开始时间
    startTime: {
      type: STRING(50),
      allowNull: true,
    },
    // 营业结束时间
    endTime: {
      type: STRING(50),
      allowNull: true,
    },
    // 联系电话
    phone: {
      type: STRING(50),
      allowNull: false,
    },
  });

  ShopModel.beforeBulkUpdate(shop => {
    shop.attributes.updateTime = new Date();
    return shop;
  });
  return ShopModel;
};

