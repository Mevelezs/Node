const { models } = require('../libs/sequelize');


class OrderServices {

  constructor (){}

  async getAll (){
    const orders = await models.Order.findAll();
    return orders;
  };

  async findOne (id){
    const order = await models.Order.findByPk(id,{
      include : [
        {
          association: 'customer',
          include : ['user']
        },
        'items'
      ]
    });
    return order;
  };

  async OrderByUser( userId ){

    const orders = await models.Order.findAll({
      where : {
        '$customer.user.id$': userId
      },
      include : [
        {
          association : 'customer',
          include : 'user'
        }
      ]
    });
    return (orders)
  }

  async createOrder (data){
    const newOrder = await models.Order.create(data);
    return newOrder;
  };

  async createItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  };

  async delete (id){
     const order = await this.findOne(id);
     const orderDeleted = await order.destroy();
     return orderDeleted.id
  }
}

module.exports = OrderServices;
