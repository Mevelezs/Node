const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../libs/sequelize');


class ProductsServices {
  constructor(){
    // this.generate();
    // this.products
  }

  generate(){
    const limit = 5;

    for (let i = 0; i < limit; i++) {
      this.products.push({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price()),
        image: faker.image.imageUrl(),
        isBlock : faker.datatype.boolean(),
      })
    }
  };

  async getAllProducts(query){

    const {limit, offset, price, price_min, price_max } = query;

    const options = {
      include: ['category'],
      where :{}
    }

    if(limit && offset){
      options.limit = limit,
      options.offset = offset
    }

    if(price){
      options.where.price = price;
    }

    if(price_min && price_max){
      options.where.price = {
        [Op.gte] :price_min,
        [Op.lte] : price_max
      }
    }
    const products = await models.Product.findAll(options)
    return products;
  };

  async findOne(id){

    const  product = await models.Product.findByPk(id);
    if(!product){
      throw boom.notFound('Product not foud');
    }
    if(product.isBlock){
      throw boom.conflict('Product is block')
    }
    return product;

  };

  async createProduct (data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  };

  update(id, changes){
    const index = this.products.findIndex(e => e.id === id);
    if(index === -1){
      throw boom.notFound('product not found');
    }
    const product = this.products[index]
    this.products[index] = {
      ...product,
      ...changes
    }
    return this.products[index]

  };

  delete(id){
    const index = this.products.findIndex(e => e.id === id);
    if(index === -1) throw boom.notFound('Product Not found');
    const productDeleted = this.products[index];
    this.products.splice(index, 1);
    return  productDeleted

  };

}

module.exports= ProductsServices;
