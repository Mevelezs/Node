
const Model = require('./model');

const getUsers = async () => {
  const users = await Model.find();
  return users;
}

const addUsers = async (newUser) => {
  const data = await Model(newUser);
  data.save()
  return data;
}
module.exports = {
  list: getUsers,
  add: addUsers,
}
