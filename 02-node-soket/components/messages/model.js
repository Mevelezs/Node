const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const mySchema = new Schema({
  user: { // aqui se obtienen los ids de los users para la relación
    type: Schema.ObjectId,
    ref: 'User'
  },
  chat: {
    type: Schema.ObjectId,
    ref: "Chat"
  },
  message: {
    type: String,
    required: true,
  },
  date: Date,
  file: String,
});

const model = mongoose.model('Message', mySchema)

module.exports = model
