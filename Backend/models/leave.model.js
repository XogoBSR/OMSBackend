'use strict';

const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    start: Date,
    end: Date,
    type: {
        type: String,
        default: "fullday"
    },
    description: String,
    status: {
        type: Number,
        default: 0
    },
    deletedAt: Date,
    userName: String,
    updatedByAdmin : {
        type : Boolean,
        default : false
    },
    specifictype: String,
    halfdaytype:String
}, { timestamps: true })

const Leave = mongoose.model("Leave", LeaveSchema)

module.exports = Leave;