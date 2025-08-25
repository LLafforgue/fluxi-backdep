var express = require('express');
var router = express.Router();
const suppliersController = require("../../controllers/suppliersController");

router.get('/tags', suppliersController.getAllTags);       // Get all tags
router.get("/", suppliersController.getAllSuppliers);     // Get all suppliers
router.post('/', suppliersController.addSupplier);       // Create new supplier
router.get("/:id", suppliersController.getSupplier);      // Get a specific Supplier
router.put('/:id', suppliersController.modifySupplier);   // Modify a specific Supplier

module.exports = router;
