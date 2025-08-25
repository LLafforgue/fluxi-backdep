const mongoose = require('mongoose');

const productionSchema = mongoose.Schema({
  product: String,
  date: {type:Date, default: new Date()},
  quantity: Number,
  nlot: String,
  cost: Number,
  start: {type:Date, default: new Date()},
  end: Date,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})

const Production = mongoose.model('productions', productionSchema);

module.exports = Production;