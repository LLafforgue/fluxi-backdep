const express = require("express");
// const mongoose = require('mongoose')
const router = express.Router();
const ordersController = require("../../controllers/ordersController");


// Create a new order : need client, finalproducts, deliveryDate
router.post('/create', ordersController.addOrder);          

// Get all orders : need user token
router.get("/", ordersController.getAllOrders );

router.get("/kpi", ordersController.getOrdersKpi );

// Update order status : need token, order ID and new status
router.put("/status", ordersController.handleStatus );

//get the last order of an client
router.get("/alert", ordersController.getAllOrdersAlert)

// get a specific order by ID : need token and order ID
router.get("/:ref", ordersController.getOneOrderById);

//get the last order of an client
router.get("/last/:customer", ordersController.getLastCustomerOrder)


module.exports = router;
