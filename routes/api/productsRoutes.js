var express = require("express");
var router = express.Router();
const productsController = require("../../controllers/productsController");


router.post("/", productsController.addProduct);                    // Create new Product
router.get("/", productsController.getAllProducts);                 // Get all Products
router.get("/alert", productsController.getAllProductsAlert);       // Get all Products
router.put("/stock", productsController.modifyProduct);             // Modify a specific Product
router.put("/name", productsController.modifyProductName);          // Modify a specific Product
router.get("/:id", productsController.getProduct);                  // Get a specific Product

module.exports = router;