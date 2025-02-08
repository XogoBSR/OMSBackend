'use strict';

const express = require('express');
const router = express.Router();
const multer  = require('multer')().none();
const activity = require('../controllers/activity.controller');

module.exports = (app) => {
    router.post("/goal", activity.registerGoal);
    router.get("/history/:id",activity.getAllActivities)
    router.patch("/checkout",multer,activity.checkOutStatusUpdate)
    router.patch("/break/over",multer,activity.overLimitBreakUpdate)
    router.patch("/breakIn",multer,activity.breakInUpdate)
    router.patch("/breakOut",multer,activity.breakOutUpdate)
    router.patch("/status",multer,activity.todayStatusUpdate)
    router.patch("/late/checkin",multer,activity.lateCheckInUpdate)
    router.patch("/early/checkout",multer,activity.ealryCheckOutUpdate)
    router.patch("/idelstart",multer,activity.idelStartUpdate)
    router.patch("/idelend",multer,activity.idelEndUpdate)
    router.patch("/product",multer,activity.productivityUpdate)
    
    app.use("/api/today", router);
};

    