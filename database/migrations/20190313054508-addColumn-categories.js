'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BOOLEAN } = Sequelize;
    await queryInterface.addColumn('categories', 'basic', {
      type: BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
