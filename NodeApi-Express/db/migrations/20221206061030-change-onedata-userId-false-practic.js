'use strict';
const {DataTypes} = require('sequelize')
const { CUSTOMER_TABLE, CustomerSchema }= require('../models/customerModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {

    await queryInterface.changeColumn( CUSTOMER_TABLE, 'user_id', {
      // no se le manda la referencia porque ya esta creada y se rompe,
      //asi se hace en todo caso no funciono porque no borre primero la info de la tabla
      allowNull: false,
      field: 'user_id',
      type: DataTypes.INTEGER,
      unique: false,
    });

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
