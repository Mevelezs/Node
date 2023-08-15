const { Model, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./userModel');

const CUSTOMER_TABLE = 'Customers'

const CustomerSchema = {
  id:{
    allowNull : false,
    type : DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey : true
  },
  name: {
    type : DataTypes.STRING,
    allowNull:false
  },
  lastName:{
    allowNull:false,
    type:DataTypes.STRING,
    field: 'last_name',
  },
  phone : {
    allowNull:false,
    type : DataTypes.STRING
  },
  cretatedAt : {
    allowNull:false,
    type: DataTypes.DATE,
    field : 'created_at',
    defaultValue: Sequelize.NOW,
  },
  userId: {
    allowNull: false,
    field: 'user_id',
    type: DataTypes.INTEGER,
    unique: true,
    references: { // aqui se pone a que tabla va relacionada
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE', // comportamiento en cascada si actializo el id.
    onDelete: 'SET NULL' // comportamiento si elimino la tabla.
  }
}

class Customer extends Model{
  static associate (models){// metodo para la asociacion;

    this.belongsTo(models.User, { as : 'user'}) // relacion 1-1, el segundo parametro es el apodo
    this.hasMany(models.Order, {as : 'orders', foreignKey : 'customerId'})
  }

  static config(sequelize){
    return {
      sequelize,
      tableName : CUSTOMER_TABLE,
      modelName : 'Customer',
      timestamps : false
    }
  }
}

module.exports = {
  CUSTOMER_TABLE,
  CustomerSchema,
  Customer
}
