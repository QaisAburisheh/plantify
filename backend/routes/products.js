const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const productController = require("../controllers/productsControllers");

// Define routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/search/:key", productController.searchProduct);
router.post("/", productController.createProduct);

module.exports = router;
