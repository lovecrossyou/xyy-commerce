'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, UUID, UUIDV4 } = Sequelize;
    await queryInterface.createTable('category', {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        // autoIncrement: true,
      },
      // 父类别id 为0时为根节点，一级类别
      parentId: {
        type: UUID,
        allowNull: true,
      },
      // 类别名称
      name: {
        type: STRING(50),
        allowNull: true,
      },
      // 类别描述
      summary: {
        type: STRING(50),
        allowNull: true,
      },
      // 类别状态1-正常，2-废弃
      status: {
        type: INTEGER(1),
        allowNull: true,
        defaultValue: 1,
      },
      // 排序编号，同类展示顺序，相等则自然排序
      sortOrder: {
        type: INTEGER(4),
        allowNull: true,
      },
      createTime: {
        type: DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updateTime: {
        type: DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    }, {
      timestamps: false,
      tablseName: 'category',
    }, {
      classMethods: {
        associate() {},
      },
    });
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
