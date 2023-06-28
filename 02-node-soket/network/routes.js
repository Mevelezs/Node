const express = require('express');
const message = require('../components/messages/messageRoutes');
const users = require('../components/users/userRoutes')
const chat = require('../components/chat/chatRoutes')

const routes = (server) => {
  server.use('/message', message)
  server.use('/user', users)
  server.use('/chat', chat)
}
module.exports = routes
