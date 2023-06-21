const express = require('express');
const cors = require('cors')
const routerApi = require('./Routs');


const { boomErrorHandler, errorHandler, error, ormErrorHandler} = require('./middlawers/middlewares');
const { checkApiKey } = require('./middlawers/authHandler');


const app = express ();

const PORT = 3000

app.get('/myApp', checkApiKey, (req, res) => {
  res.send('Hola, soy la App')
})
app.use(express.json()) // middlewere general para que la app reciba json por body.

//cofiguración de cors.
const whitelist = ['http://127.0.0.1:5500', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}

app.use(cors(options));
require ('./utils/auth')


app.get ('/', (req, res) =>{
  res.send('hello world');
}).listen(PORT, () => {console.log('escuchando en el puerto ' + PORT)})


routerApi(app);

app.use(error); // ojo los middleware  que no son generales deben ir en orden de ejecucion y debajo del route de la aplicación (routeApi(app))
app.use(ormErrorHandler)
app.use(boomErrorHandler);
app.use(errorHandler);
