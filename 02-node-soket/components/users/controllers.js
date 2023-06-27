const store = require('./store');

const getUsers = () => {
  return new Promise((resolve, reject) => {
    resolve(store.list())
  });

}

const addUsers = (body) => {
  return new Promise((resolve, reject) => {
    if (!body.email || !body.name) {
      reject('Invalid data')
      throw 'Invalid data';
    }
    const newUser = {
      name: body.name,
      email: body.email,
    }
    store.add(newUser)
    resolve(newUser)
  })
}


module.exports = {
  getUsers,
  addUsers,
}
