const mongoose = require("mongoose");


const taskObj = new mongoose.Schema({
    taskTitle: {
        type: String,
        default: ""
    },
    assignee: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalHours:{
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    priority: {
        type: String,
        default: "Low"
    },
    description: {
        type: String
    },
    taskType:{
        type: String,
        default: "Normal"
    },
    billingStatus: {
        type: String,
        default: "Non-Billable"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    taskStatus:{
        type:String,
        default:"In Progress"
    },
    taskTags : {
        type: String,
        default:"Development"
    }
   
});

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        default: ""
    },
    taskArr: {
        type: [taskObj]
    },
    description: {
        type: String,
        default: ""
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    priority: {
        type: String,
        default: ""
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    taskTag: {
        type: [String],
    },
    billingStatus: {
        type: String,
    },
    spentTime: {
        type: Number,
        default: 0
    },
    visibility: {
        type: Boolean,
        default: false

    },
    estimatedHours: {
        type: Number,
        default: 0
    },
    totalHours: {
        type: Number,
        default: 0
    },
    status:{
        type:String,
        default:"Ongoing"
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
