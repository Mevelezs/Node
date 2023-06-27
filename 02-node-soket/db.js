const db = require("mongoose");

db.Promise = global.Promise; // para que resuelva todas la promesas con el global de js

function connect(uri) {
  return new Promise((resolve, reject) => {
    db.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "telegrom",
    })
      .then(() => resolve(), console.log("conectado"))
      .catch(() => reject());
  });
}

module.exports = { connect };
