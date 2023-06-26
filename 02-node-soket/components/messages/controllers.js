const store = require('./store')

const addMesages = (user, message) => {
  return new Promise((resolve, reject) => {
    const fullMesage = {
      user,
      message,
      data: new Date()
    }
    store.add(fullMesage)
    resolve(fullMesage)
  })
}

const getMessages = (user) => {
  return new Promise((resolve, reject) => {
    resolve(store.list(user))
  })
}

const updateMessage = (id, message) => {
  return new Promise((resolve, reject) => {
    if (!id || !message) {
      reject()
      console.log('faltan datos');
      return false;
     }
     store.update(id, message).then(() => resolve()).catch((e) => reject(e))  
  })
}

const removeMessage = (id) => {
  return new Promise((resove, reject) => {
    store.remove(id).then(() => resove()).catch((e) => reject(e))
  })
}

module.exports = {
  addMesages,
  getMessages,
  updateMessage,
  removeMessage,
};
