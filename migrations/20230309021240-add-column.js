'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn(
      'posts', // column을 추가할 테이블 이름
      'image', // colunm 추가할 칼럼 이름
      {
        type: Sequelize.BLOB,
        allowNull: true, // Null 값을 허용할지 말지 결정함, 만약 false로 지정하면 값이 Null인 경우 값을 DB에 저장하지 않는다. 
      }       
    )
     

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
