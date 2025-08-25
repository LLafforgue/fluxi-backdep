const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
  name: String,
  tags: [String],
  phone: String,
  email: String,
  address: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

const Supplier = mongoose.model("suppliers", supplierSchema);

module.exports = Supplier;
