'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize;
    await queryInterface.addColumn('shops', 'phone', {
      type: STRING(50),
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      phone: {
      type: STRING(50),
      allowNull: false,
    },

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
