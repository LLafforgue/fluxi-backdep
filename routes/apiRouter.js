var express = require('express');
var router = express.Router();
var customersRouter = require("./api/customersRoutes");
var productionsRouter = require("./api/productionsRoutes");
var productsRouter = require("./api/productsRoutes");
var ordersRouter = require("./api/ordersRoutes");
var suppliersRouter = require("./api/suppliersRoutes");

router.use("/customers",customersRouter);
router.use("/productions",productionsRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/suppliers", suppliersRouter);
router.get("/check-token",(req, res) => {
    return res.status(200).json({result: true})
})

module.exports = router;