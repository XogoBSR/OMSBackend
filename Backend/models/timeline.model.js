'use strict';
const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    fromTime : {
        type : Date
    },
    toTime : {
        type : Date
    },
    description : {
        type : String
    },
    task : {
        type : String
    },
    status:{
        type: Number,
        default: 0
    },
    updatedByAdmin: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String
    },
    requestFrom: {
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

const Timeline = mongoose.model("timeline",requestSchema)

module.exports = Timeline