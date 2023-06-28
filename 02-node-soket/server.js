const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./network/routes");
const { connect } = require("./db");
require("dotenv").config();
const socket = require("./socket");

const app = express();
const server = require("http").Server(app);

socket.connect(server);

//uri = "mongodb+srv://mauricio:admin123@platzi2.sssc1mq.mongodb.net/";

const uri = process.env.URI;
connect(uri);

app.use(bodyParser.json());
routes(app);
app.use('/app' , express.static('public'))
server.listen(3000, console.log("listen to port 3000"));
