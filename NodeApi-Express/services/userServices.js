/*
const getConnection = require("../libs/postgres");

class UserServices{  // coneccion sensilla con la db;
  constructor(){}

  async find(){
    const client = await getConnection();
    const rta = await client.query('SELECT * FROM ejemplo');
    return rta.rows;
  }
}
*/
// const pool = require('../libs/postgresPool')

// class UserServices { // coneccion con Pool
//   constructor() {
//     this.pool = pool;
//     this.pool.on('error', (error) =>{ console.error(error)})
//    }

//   async find() {
//     const query = 'SELECT * FROM ejemplo';
//     const rta = await this.pool.query(query)
//     return rta.rows;
//   }
// }

/*
const sequelize = require('../libs/sequelize')
class UserServices { // coneccion con Sequelize
  constructor() {}

  async find() {
    const query = 'SELECT * FROM ejemplo';
    const [data, metadata]= await sequelize.query(query)
    return {data, metadata}
  }
}
*/

// Con los modelos

const  boom = require('@hapi/boom');
const bcrypt = require ('bcrypt');
const { models } =require ('../libs/sequelize')

class UserServices { // coneccion con Sequelize
  constructor() { }


  async getAll() {
    const users = await models.User.findAll(
      {
        include : ['customer']
      }
    );
    return users;
  }


  async findByEmail(email) {
    const user = await models.User.findOne({
        where: {email}
      });
    return user;
  }

  async findOne(id){
    if(!id){
      throw boom.notFound('Not found');
    }
    const data = await models.User.findByPk(id);
    if(!data){
      throw boom.notFound('Not found data');
    }
    delete data.dataValues.password
    return data;
  }



  async createUsers(data) {
    const hash = await bcrypt.hash(data.password, 10);

    const user = await models.User.create({
      ...data,
      password: hash
    });

    delete user.dataValues.password
    return user;
  }

  async update (id, changes){
    const data = await this.findOne(id);
    const rta = await data.update(changes);
    return rta;
  }

  async delete(id){
    if(!id){
      throw boom('Not found')
    }
    const data = await this.findOne(id);
    const rta = await data.destroy()
    return { id }
  }

}
module.exports = UserServices;
