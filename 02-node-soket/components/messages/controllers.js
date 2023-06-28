const store = require("./store");
const socket = require("../../socket").socket;

const addMesages = (user, message, chat, file) => {
  return new Promise((resolve, reject) => {
    let fileUrl = "";
    if (file) {
      fileUrl = "http://localhost:3000/app/files/" + file.filename;
    }
    const fullMesage = {
      user,
      message,
      chat,
      date: new Date(),
      file: fileUrl,
    };
    store.add(fullMesage);
    socket.io.emit("message", fullMesage);
    resolve(fullMesage);
  });
};

const getMessages = (user) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(user));
  });
};

const updateMessage = (id, message) => {
  return new Promise((resolve, reject) => {
    if (!id || !message) {
      reject();
      console.log("faltan datos");
      return false;
    }
    store
      .update(id, message)
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};

const removeMessage = (id) => {
  return new Promise((resove, reject) => {
    store
      .remove(id)
      .then(() => resove())
      .catch((e) => reject(e));
  });
};

module.exports = {
  addMesages,
  getMessages,
  updateMessage,
  removeMessage,
};
