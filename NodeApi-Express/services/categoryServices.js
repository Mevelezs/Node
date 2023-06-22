 const { models } = require('../libs/sequelize');
 const boom = require ('@hapi/boom');

 class CategoryServices {

  constructor(){}

  async getAll(){

    const data = await models.Category.findAll();
    return data;

  };

  async findOne(id){

    if(!id){
      throw boom.notFound('Category no found');
    }
    const category = await models.Category.findByPk(id,
      {
        include : ['products']
      });
    return category;

  };

  async createCategory (data){

   const newCategory = await models.Category.create(data);
   return newCategory;

  };

  async updateCategory (id, changes){

    const category = await this.findOne(id);
    const newCategory = await category.update(changes)
    return newCategory;
  };

  async deleteCategory (id){

    const category = await this.findOne(id);
    const categoryDeleted = await category.destroy();
    return { id };
  };

 };

 module.exports = CategoryServices;
