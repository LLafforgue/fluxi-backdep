const express = require("express");
const router = express.Router();
const productionController = require("../../controllers/productionController");


router.post("/", productionController.addProduction);         // Create new Production + increment stock & decrement brut stock
router.get("/", productionController.getAllProduction);    // Get all Production


module.exports = router;
