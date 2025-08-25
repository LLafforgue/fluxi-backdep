const mongoose = require('mongoose');

const brutProductSchema = mongoose.Schema({
  name: String,
  type: String,
  stock: Number,
  unity: String,
  cost: Number,
  supplier: {type: mongoose.Schema.Types.ObjectId, ref: 'suppliers'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}

})

const BrutProduct = mongoose.model('brutProducts', brutProductSchema);

module.exports = BrutProduct;