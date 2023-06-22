const { Sequelize, DataTypes, Model }= require ('sequelize');

const { CUSTOMER_TABLE } = require ('./customerModel');
const { OrderProduct } = require('./order_ProductModel');


const ORDER_TABLE = 'orders';

const OrderSchema = {
  id:{
    allowNull: false,
    autoIncrement : true,
    primaryKey : true,
    type : DataTypes.INTEGER
  },
  customerId:{
     field : 'custumer_id',
     allowNull: false,
     type: DataTypes.INTEGER,
     references: {
        model : CUSTOMER_TABLE,
        key : 'id'
     },
     onUpdate : 'CASCADE',
     onDelete: 'SET NULL'
  },
  createAt:{
    field: 'create_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue : Sequelize.NOW
  },

  total : {
    type : DataTypes.VIRTUAL,
    get (){// no usar si los datos son muchos + 100; (escribir una consulta directamente a la db)
      if(this.items && this.items.length > 0){

        return this.items.reduce((total, items) => {
          return  total + (items.price * items.OrderProduct.amount);
        }, 0 );
      }
      return 0;
    }
  }
}

class Order extends Model {
  static associate (models){
    this.belongsTo(models.Customer, { as : 'customer'});
    this.belongsToMany(models.Product, {
      as : 'items',
      through : models.OrderProduct,
      foreignKey :'orderId',
      otherKey : 'productId'
    })

  }

  static config (sequelize){
    return {
      sequelize,
      tableName : ORDER_TABLE,
      modelName : 'Order',
      timestamps :false
    }
  }
}

module.exports = {
  ORDER_TABLE,
  OrderSchema,
  Order
}
