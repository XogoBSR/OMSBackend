'use strict';

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        text: true
    },
    password: String,
    name: {
        type: String,
        text: true
    },
    phone: String,
    avatar: {
        type: String,
        default: ""
    },
    country: Object,
    city: String,
    address: String,
    gender: String,
    birthday: String,
    description: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    designation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation"
    },
    role: Array,
    status: Number,
    lastActive: Date,
    deletedAt: Date,
    totalLeaves: Number,
    leaveTaken: {
        type: Number,
        default:0
    },
    availableLeaves: Number,
    paidLeaves:{
        type: Number,
        default: 0
    },
    unpaidLeaves: {
        type: Number,
        default: 0
    },
    otherLeaves:{
        type: Number,
        default: 0
    }
}, { timestamps: true })

UserSchema.pre('save',function(next) {
   
    this.availableLeaves = this.totalLeaves
    console.log(" Availabel Leaves ",this.availableLeaves,this.totalLeaves)
    next()
})
const User = mongoose.model("User", UserSchema)


module.exports = User;