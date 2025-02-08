'use strict';

const express = require('express');
const router = express.Router();
const multer  = require('multer')().none();

const setting = require('../controllers/setting.controller');

module.exports = (app) => {
    router.get("/", setting.getSetting);
    router.patch("/:id", multer, setting.updateSetting);
    router.patch("/company/leave/:id", multer, setting.addCompanyLeave);
    router.delete("/delete/company/leave/:id", multer, setting.deleteCompanyLeaves);
    app.use("/api/setting", router);
};
