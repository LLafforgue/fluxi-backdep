const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: String,
    tags: [String],
    phone: String,
    email: String,
    address: String,
    order: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    latitude: Number,
    longitude: Number,
  })

const Customer = mongoose.model('customers', customerSchema);

module.exports = Customer;