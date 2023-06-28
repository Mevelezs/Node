const store = require('./store');

const getChat = (userId) => {
  return store.list(userId)
}

const addChats = (users) => {
  if (!users || !Array.isArray(users)) {
    return Promise.reject('invalid user list')
  }
  const chat = {
    users,
  }
  return store.add(chat)

}


module.exports = {
  getChat,
  addChats,
}
