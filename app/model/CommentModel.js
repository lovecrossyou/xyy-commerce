module.exports = app => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4 } = app.Sequelize;

  const CommentModel = app.model.define('comments', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: STRING(50),
      allowNull: true,
    },
    goods_id: {
      type: STRING(50),
      allowNull: true,
    },
    order_id: {
      type: STRING(50),
      allowNull: true,
    },
    // 物流评价
    supplier_comment_grade: {
      type: INTEGER(2),
      allowNull: false,
    },
    // 商品评价
    goods_comment_grade: {
      type: INTEGER(2),
      allowNull: false,
    },
    // 商品评价内容
    goods_comment_content: {
      type: STRING(500),
      allowNull: false,
    },
    comment_time: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });

  return CommentModel;
};
