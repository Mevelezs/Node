const Model = require("./model");

const getChats = async (userId) => {
  let filtered = {};
  if (userId) {
    filtered = {
      users: userId,
    };
  }
  try {
    const data = await Model.find(filtered).populate("users").exec();
    return data
  } catch (error) {
    throw new Error(error);
  }
};

const addChat = async (chat) => {
  const data = await Model(chat);
  data.save();
  return data;
};
module.exports = {
  list: getChats,
  add: addChat,
};
