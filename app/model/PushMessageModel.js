module.exports = app => {
  const { STRING, UUID, UUIDV4 } = app.Sequelize;

  const PushMessageModel = app.model.define('pushMessage', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    // 用户
    userId: {
      type: STRING(50),
      allowNull: false,
    },
    // 推送标示 clientId
    clientId: {
      type: STRING(50),
      allowNull: false,
    },
    alias: {
      type: STRING(20),
      allowNull: true,
    },
    groupId: {
      type: STRING(50),
      allowNull: true,
    },
  });
  return PushMessageModel;
};

