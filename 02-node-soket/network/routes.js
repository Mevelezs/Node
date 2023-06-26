const express = require('express');
const message = require('../components/messages/messageRoutes')

const routes = (server) => {
  server.use('/message', message)
}
module.exports = routes
