const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./network/routes");
const { connect } = require("./db");
require('dotenv').config()

//uri = "mongodb+srv://mauricio:admin123@platzi2.sssc1mq.mongodb.net/";

const uri = process.env.URI

connect(uri);
const app = express();
app.use(bodyParser.json());
routes(app);

app.listen(3000, console.log("listen to port 3000"));
