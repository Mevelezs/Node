// Archivo de conección entre el modelo y el orm. (envia la conección a los modelos para la serialización de los datos).

const { User, UserSchema } = require('./userModel');
const { Customer, CustomerSchema } = require('./customerModel');
const { Category, CategorySchema } = require('./categoryModel');
const { Product, ProductSchema } = require ('./productModel');
const { Order, OrderSchema} = require ('./orderModels');
const {OrderProduct, OrderProductSchema} = require ('./order_ProductModel')

// declaro una funcción que resibe sequelize como parametro, inicializa el modelo pasandole como parametro la schema y la configuración con sequelize como parametro que es lo que requiere el modelo
function setupModels (sequelize){
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Order.init (OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config (sequelize))



  // generando las asociaciones (relaciones)
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
}

module.exports = setupModels;
