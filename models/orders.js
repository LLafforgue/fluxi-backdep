const mongoose = require("mongoose");
const Customer = require("./customer");

const productSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'finalproducts' },
  quantity: Number,
});

const ordersSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
    products: [productSchema],
    creationDate: { type: Date, default: new Date()},
    deliveryDate: { type: Date, default: new Date()},
    ref: String,  
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    price: Number,
    cost: Number,
    status: {type: String, default: "En cours", validate: {
      validator: function(value) {
        return ['en cours', 'livrée'].includes(value.toLowerCase());
      }},
      message: function (prop){ `${prop.value} n'est pas un statut valide!`}
      },
});

const Order = mongoose.model("orders", ordersSchema);

module.exports = Order;
