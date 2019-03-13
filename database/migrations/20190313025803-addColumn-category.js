'use strict';

/**
 * 添加表字段
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize;
    await queryInterface.addColumn('category', 'type', {
      // 类别状态0-店铺商品类型，1-水质检测类型
      type: INTEGER(1),
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
