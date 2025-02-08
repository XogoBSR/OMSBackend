'use strict';

const express = require('express');
const router = express.Router();
const multer  = require('multer')().none();
const timeline = require('../controllers/timeline.controller');

module.exports = (app) => {

    router.patch("/update/:id",multer,timeline.updateTimelineRequest)
    router.post("/create",timeline.createTimelineRequest)
    router.get("/get",timeline.getTimelineRequests)
    router.get("/get/:date/:id",timeline.getTimelineRequests)
    router.delete("/delete/:id",timeline.deleteTimelineRequest)
    app.use("/api/timeline", router);
}