const express = require('express');
const morgan = require('morgan')

const app = express();
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('API');
})

app.listen(3001, console.log('en el 3001'))
