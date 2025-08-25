const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'brutProducts'},
  quantity: Number,
})

const finalProductSchema = mongoose.Schema({
  name: String,
  stock: Number,
  unity: String,
  cost: Number,
  receipe: [ingredientSchema],
  price: Number,
  dlc: Number,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})

const FinalProduct = mongoose.model('finalproducts', finalProductSchema);

module.exports = FinalProduct;