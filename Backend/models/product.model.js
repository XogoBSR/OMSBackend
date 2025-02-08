const mongoose = require("mongoose");

// const subTaskObj = new mongoose.Schema({
//     taskTitle: {
//         type: String,
//         default: ""
//     },
//     assignee: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "User"
//     },
//     reporter: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null
//     },
//     status:{
//         type: String,
//         default: 'Incomplete'
//     }
// });

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
    // subTaskArr: {
    //     type: [subTaskObj]
    // }
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
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
