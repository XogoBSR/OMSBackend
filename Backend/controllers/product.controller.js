'use strict'

const ProductService = require("../services/product.service")

exports.createProduct = async(req,res) => {

    let result = await ProductService.createProduct(req.body)
    return res.status(200).json(result)
}

exports.updateProduct = async (req,res) => {
    const {id} = req.params
    let result = await ProductService.updateProduct(id,req.body)
    return res.status(200).json(result)
}

exports.getProducts = async (req,res) => {
    let result = await ProductService.getProducts()
    return res.status(200).json(result)
}

exports.deleteProduct = async (req,res) => {
    const {id} = req.params
    let result = await ProductService.deleteProduct(id)
    return res.status(200).json(result)
}

exports.getProductById = async (req,res) => {
    const {id} = req.params
    let result = await ProductService.getProductById(id)
    return res.status(200).json(result)
}

exports.createTask = async (req,res) => {
    const {id} = req.params
    let result = await ProductService.createTask(id,req.body)
    return res.status(200).json(result)
}

exports.getProductsByUser = async (req,res) => {
    const {id} = req.params
    
    console.log("Brefpr Product By ID ", id)
    let result = await ProductService.getProductsByUser(id)
    console.log("AFter Product By ID ",result)
    return res.status(200).json(result)
}


exports.updateTask = async (req,res) => {

    const {productid,taskid} = req.params
    const {body} = req.body
    const result = await ProductService.updateTask(productid,taskid,body)
    return res.status(200).json(result)
}
