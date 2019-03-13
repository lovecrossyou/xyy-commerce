'use strict';
/**
 * 修改表结构字段
 */
module.exports = {
  up: async queryInterface => {
    await queryInterface.renameColumn('category', 'desc', 'summary');
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
