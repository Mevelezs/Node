const fs = require ('fs')

console.log(__dirname) // lista la ruta de carpeta donde estoy parado;
console.log(__filename) // lista la ruta del archivo que estoy ejecutando;

const leer = (ruta, cb) =>{
  fs.readFile(ruta, (err, data) =>{
    cb(data.toString())
  })
}

//leer(__dirname + '/demo.js', console.log) // funcion para leer archivos


const escribir = (ruta, contenido, cb) =>{
   fs.writeFile(ruta, contenido, (err,) => {
    if(err){
        console.error('No se escribió ni mierda', err)
    }else{
        console.log('Se escribió correctamente')
    }
   })
}

escribir(__dirname + '/archivo.txt', 'Escribiendo nuevas maricadas en el archivo', console.log) // reescribe cosas en el achivo de destino y si nop existe lo crea.


const borrar = (ruta, cb) =>{
  fs.unlink(ruta, (err) =>{

  })
}

borrar(__dirname + '/demo.js', console.log('Se borró esa mondá'))// borra el archivo en la ruta indicada.

