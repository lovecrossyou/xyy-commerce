module.exports = app => {
  const { DATE, STRING, UUID, UUIDV4 } = app.Sequelize;

  const TokenModel = app.model.define('token', {
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
    tokenString: {
      type: STRING(50),
      allowNull: false,
      unique: true,
    } });

  TokenModel.beforeBulkUpdate(token => {
    token.attributes.updateTime = new Date();
    return token;
  });
  return TokenModel;
};
