'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING } = Sequelize;
    await queryInterface.addColumn('categories', 'type', {
      // 类别状态0-店铺商品类型，1-水质检测类型
      type: INTEGER(1),
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('categories', 'extra', {
      type: STRING(50),
      allowNull: true,
    });
    await queryInterface.renameColumn('categories', 'desc', 'summary');

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
