'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DATE } = Sequelize;
    await queryInterface.addColumn('shops', 'updateTime', {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
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
