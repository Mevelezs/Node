const moment = require('moment');

let ahora = moment();

console.log(ahora.toISOString());
console.log(ahora.format('YYYY/MM/DD ---> HH:mm:ss'));
