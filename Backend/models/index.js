'use strict';

const mongoose = require("mongoose");

mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose

db.user = require("./user.model");
db.department = require("./department.model");
db.designation = require("./designation.model");
db.attendance = require("./attendance.model");
db.expenses = require("./expenses.model");
db.leave = require("./leave.model");
db.setting = require("./setting.model");
db.activity = require("./activity.model")
db.timeline = require("./timeline.model")
db.product = require("./product.model")
db.client = require("./client.model")


exports.db = db;

exports.connectDatabase = async () => {
    let environment = process.env.MONGO_URI;
    console.log("Environment ",environment)

    if (process.env.ENVIRONMENT === 'production') {
        environment = process.env.PROD_MONGODB_URL;
    }

    await mongoose.connect(environment, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    });
}