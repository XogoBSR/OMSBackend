'use strict';

const mongoose = require("mongoose")


const clientSchema = new mongoose.Schema({
    name: {
        type:String,
        require: true
    },
    organization: {
        type:String,
        require: true
    }
})

const Client = mongoose.model("Client",clientSchema)

module.exports = Client