'use strict'

const { db } = require("../models")
const Product = db.product;


exports.getProducts = async(queries) => {
    
    const limit =  20;
    const page =  1;
    const skip = limit * (page - 1);
    const sort = { createdAt: -1 };

    let results = await Product.find().
    skip(skip).
    limit(limit).
    sort(sort)

    const counts = results.length;
    console.log("Get Task Count ",counts)
    return {
        pagination: {
            perPage: limit,
            currentPage: page,
            counts,
            pages: Math.ceil(counts / limit)
        },
        data: results
    }
}

exports.createProduct = async(body) => {

    console.log("Create Task ",body)
    const {productName,taskName,description,reporter,startDate,endDate,taskTags,priority,client,members} = body
    let result = await Product.create({
        productName,
        taskName,
        description,
        startDate,
        endDate,
        taskTags,
        priority,
        client,
        reporter,
        members

    })
    return result
}

exports.updateProduct = async (id,body) => {
  
    let existingProduct = await Product.findById(id)
    if (!existingProduct) {
        throw new Error('Product not found');
    }
    console.log("Body Data ",body)
    if (body?.description) existingProduct.description = body.description;
    if (body?.taskTitle) existingProduct.title = body.taskTitle;
    if (body?.startDate) existingProduct.startDate = body.startDate;
    if (body?.endDate) existingProduct.endDate = body.endDate;
    if (body?.members) {
        console.log("Body Members ",body.members)
        existingProduct.members = body.members
    };
    await existingProduct.save();

    return existingProduct
}

exports.deleteProduct = async (body) => {
    let result = await Product.deleteOne(body._id)
    return result
}

exports.getProductById = async (id) => {
    let result = await Product.findById(id)
    return {
        data:result
    }
}   

exports.createTask = async (id,body) => {
    console.log("Create TASK ",body )
    let existingProduct = await Product.findById(id)
    if (!existingProduct) {
        throw new Error('Product not found');
    }

    let taskObj = {
        taskTitle: body.taskTitle,
        assignee: body.assignee,
        reporter: body.reporter
    }
    existingProduct.taskArr.push(taskObj)
    await existingProduct.save();
    return existingProduct

}

exports.getProductsByUser = async (id) => {
    try {
        let result = await Product.find({
            $or: [
                { members: { $in: [id] } },  
                { visibility: true }         
            ]
        });
        
        console.log("Get Product By USer ",result)
        return {
            data:result
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

