'use strict';

const express = require('express');
const router = express.Router();
const multer  = require('multer')().none();
const product = require('../controllers/product.controller');

module.exports = (app) => {
    router.get("/", product.getProducts);
    router.post("/create", product.createProduct);
    router.patch("/update/:id",multer,product.updateProduct)
    router.delete("/delete/:id",product.deleteProduct)
    router.get("/:id",product.getProductById),
    router.patch("/create/task/:id",multer,product.createTask),
    router.get("/user/:id",product.getProductsByUser)
    app.use("/api/product", router);
};
