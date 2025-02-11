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
    let environment = process.env.MONGODB_URL;
    console.log("ENVIRONMN",environment)

    if (process.env.ENVIRONMENT === 'production') {
        environment = process.env.PROD_MONGODB_URL;
    }

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      })
      .then(() => console.log("✅ MongoDB Connected Successfully"))
      .catch(err => console.error("❌ MongoDB Connection Error:", err));
}