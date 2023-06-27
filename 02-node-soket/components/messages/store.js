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
  try {
    const messages = await Model.find(filter)
      .populate("user") // popula la data de user para que se muestre
      .exec();
    return messages;
  } catch (error) {
    throw new Error(error);
  }
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
