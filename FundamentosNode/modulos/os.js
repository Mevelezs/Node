
const os = require('os'); // Es el sistema operativo


console.log(os.arch())// bites del sistema;
console.log(os.platform()) // nombre sel sistema;
console.log(os.cpus()) // nucleos de la  cpu;
console.log(os.constants);
console.log(os.freemem()) // memoria libre en bites;

const SIZE = 1024;

const kb = (bytes) =>{
  return bytes / SIZE;
}

const mb = (bytes) => {
    return kb(bytes) / SIZE;
}
const gb = (bytes) => {
    return mb(bytes) / SIZE;
}


console.log(os.freemem());
console.log(kb(os.freemem()))
console.log(mb(os.freemem()))
console.log(gb(os.freemem()))// gigas disponibles;

console.log(gb(os.totalmem()))// total de gigas que tengo;



