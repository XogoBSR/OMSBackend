'use strict'

const express = require("express")
const router = express.Router()
const multer  = require('multer')().none();
const client = require("../controllers/client.controller")

module.exports = (app) => {
    router.get("/", client.getClient);
    router.post("/create", client.createClient);
    router.delete("/delete/:id",client.deleteClient);
    router.patch("/update/:id",multer,client.updateClient);
    app.use("/api/client", router);
};