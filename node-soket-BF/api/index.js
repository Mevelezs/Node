const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const { Server } = require("socket.io");

const http = require("http");


const app = express();
app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(morgan("dev"));

app.get('/', (req, res) => {
  res.send('hello')
})

io.on('connection', (socket) => {
  console.log(socket.id); // id del frontend conectado
  
  socket.on('message', (message) => { // recibe el mensaje del cliente (submit)
    console.log(message);
    socket.broadcast.emit('message', {
      body: message,
      from: socket.id
    }) // reenvia el mensaje a los otros clientes
  })
})

// app.listen(3001, console.log('app en 3001'))
server.listen(3002, console.log("server en el 3002"));
