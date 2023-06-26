const Model = require("./model");

const addMessage = (message) => {
  const myMessage = new Model(message);
  myMessage.save();
};

const getMessage = async (user) => {
  let filter = {};
  if (user) {
    filter = { user: user };
  }
  const messages = await Model.find(filter);
  return messages;
};

const updateMessage = async (id, message) => {
  const newMessage = await Model.findOne({ _id: id });
  newMessage.message = message;
  await newMessage.save();
};

const removeMessage = (id) => {
  return Model.deleteOne({ _id: id });
};

module.exports = {
  add: addMessage,
  list: getMessage,
  update: updateMessage,
  remove: removeMessage,
};
