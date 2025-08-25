var express = require('express');
var router = express.Router();
const customersController = require("../../controllers/customersController");

router.get('/tags', customersController.getAllTags)       // Get all tags
router.get('/', customersController.getAllCustomers);     // Get all customers
router.post('/', customersController.addCustomer);        // Create new customer
router.get('/:id', customersController.getCustomer);      // Get a specific Customer
router.put('/:id', customersController.modifyCustomer);   // Modify a specific Customer

module.exports = router;
