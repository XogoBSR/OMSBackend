
const {db} = require('../models')

const Client = db.client

exports.createClient = async(body) => {
    const result = await Client.create(body)
    return result
}

exports.getClients = async() => {
    const result = await Client.find()
    console.log("GET CLIENT Result ",result)
    return {
        data:result
    }
}

exports.deleteClient = async(id) => {
    const result = await Client.findByIdAndDelete(id)
    return result
}

exports.updateClient = async(_id,body) => {
    console.log("FInd By ID ",_id,body)
    const result = await Client.findByIdAndUpdate(_id,
        body.payload
    )
    return result
}