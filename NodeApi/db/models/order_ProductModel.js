const { Model, DataTypes, Sequelize } = require('sequelize');
const { ORDER_TABLE } = require('./orderModels');
const { PRODUCT_TABLE } = require('./productModel');


const ORDER_PRODUCT_TABLE = 'order_products';

const OrderProductSchema = {
  id: {
    allowNull :false,
    type : DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement :true,
  },

  amount :{
    allowNull : false,
    type: DataTypes.INTEGER
  },

  orderId:{
     allowNull:false,
     field : 'order_id',
     type : DataTypes.INTEGER,
     references : {
       model : ORDER_TABLE,
       key : 'id'
     },
     onUpdate : 'CASCADE',
     onDelete : 'SET NULL'
  },

  productId: {
    allowNull: false,
    field: 'product_id',
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },

  createAt: {
    field: 'create_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }

};

class OrderProduct extends Model{
  static associate (models){};

  static config (sequelize){
    return {
      sequelize,
      tableName : ORDER_PRODUCT_TABLE,
      modelName : 'OrderProduct',
      timestamps : false
    }
  }

};

module.exports = { ORDER_PRODUCT_TABLE, OrderProduct, OrderProductSchema }
