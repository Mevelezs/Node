const express = require('express');
const message = require('../components/messages/messageRoutes');
const users = require('../components/users/userRoutes')

const routes = (server) => {
  server.use('/message', message)
  server.use('/user', users)
}
module.exports = routes
