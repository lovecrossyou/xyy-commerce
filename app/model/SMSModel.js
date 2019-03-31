module.exports = app => {
  const { DATE, STRING, UUID, UUIDV4, INTEGER } = app.Sequelize;

  const SMSModel = app.model.define('sms', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    // 用户
    phoneNum: {
      type: STRING(12),
      allowNull: false,
    },
    // 验证码
    code: {
      type: STRING(6),
      allowNull: false,
    },
    // 验证码状态 0未使用 1 已使用
    status: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    createTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });
  return SMSModel;
};
