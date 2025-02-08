'use strict'

const ClientService = require("../services/client.service")

exports.createClient = async(req,res) => {

    console.log("Client Create ",req.body)
    let result = await ClientService.createClient(req.body)
    return res.status(200).json(result)
}

exports.updateClient = async (req,res) => {
    const {id} = req.params
    console.log("ID Got ",id)
    let result = await ClientService.updateClient(id,req.body)
    return res.status(200).json(result)
}

exports.getClient = async (req,res) => {
    let result = await ClientService.getClients()
    // console.log("GET CLIENT" , result)
    return res.status(200).send(result)
}

exports.deleteClient = async (req,res) => {
    const {id} = req.params
    let result = await ClientService.deleteClient(id)
    return res.status(200).json(result)
}


