'use strict';

const mongoose = require("mongoose");


const companyLeaveObj = {
    leaveDate : {
        type:Date,
        unique:true
    },
    description : String
}

const SettingSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    country: String,
    email: String,
    phone: String,
    leaveLimit: Number,
    day: String,
    companyLeaveArr : [companyLeaveObj]
}, { timestamps: true })

const Setting = mongoose.model("Setting", SettingSchema)

module.exports = Setting;