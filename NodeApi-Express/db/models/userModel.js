const{ Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'Users'; // nombre de la tabla;

const UserSchema = { // esquema de construccion de la tabla (atributos).
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  recoveryToken: {
    field : 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  role:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'customer'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'create_at',// con esto le doy el nombre que quiero en la db, este es la convencion.
    defaultValue: Sequelize.NOW // se define en el momento del registro
  }

}

class User extends Model{
  static associate (models){

    this.hasOne(models.Customer, { as: 'customer', foreignKey: 'userId' }); // apodo de la tabla y como la voy a encontrar(foreignkey)

  }

  static config(sequelize){ // metodo que recibe la conección y retorna la configuración del modelo.
     return{
      sequelize, // conección
      tableName: USER_TABLE, // nombre de la tabla
      modelName : 'User', // nombre del modelo.
      timestamps : false // crea campos por defecto cuando está habilitado.
     }
  }
}

module.exports = { USER_TABLE, UserSchema, User }

