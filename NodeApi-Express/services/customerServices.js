const { models }=require('../libs/sequelize');
const boom = require('@hapi/boom');
const bcrypt = require ('bcrypt')


class CutomerServices {
  constructor(){}

  async getAll (){
    const rta = await models.Customer.findAll(
      {
      include : ['user']
    }
    );
    return rta
  }

  async findOne (id){
    if(!id){
      throw boom.notFound('Not found');
    }
     const data = await models.Customer.findByPk(id);
    if(!data){
      throw boom.notFound('No found data');
    }
    return data;
  }

  async createCustomer (data){
    const hash = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user:{
        ...data.user,
        password : hash
      }
    }

    const newCustomer =await  models.Customer.create(newData, {
      include: ['user']
    });

    delete newCustomer.user.dataValue.password
    return newCustomer;
  }

  async updateCustomer (id, changes){
    const data = await this.findOne(id);
    const rta = await data.update(changes);
    return rta;
  }

  async deleteCustomer (id){

    const customer = await this.findOne(id);
    const rta = await customer.destroy();
    return rta.id;

  }
}

module.exports = CutomerServices;
