'use strict';


const  Activity  = require("../services/activity.service");

const getAllActivities = async (req,res) => {
    const {params} = req
    console.log("GET ACTIBVIES ",req.url)
    const result = await Activity.getAllActivities(params.id)
    
    return res.status(200).send(result)
}

const registerGoal = async (req,res) => {

    const result = await Activity.createTodayGoal(req)
    if(result) res.status(200).send(result)
    else return res.status(500).json({message:"Error"})

}

const checkOutStatusUpdate = async (req,res) => {
    console.log("Check Out Status Body ",req.body)
    const {_id} = req.body
    const result = await Activity.checkOutStatusUpdate(_id)
    console.log(result)
    if(result) {
        res.status(200).json({msg:"Ok"})
    }

}

const breakInUpdate = async (req,res) => {
    console.log("Body Break In  ",req.body)
    const result = await Activity.breakInStatusUpdate(req.body)
    return res.status(200).json(result)
}

const breakOutUpdate = async (req,res) => {
    console.log("Body Break Out ",req.body)
    const result = await Activity.breakOutStatusUpdate(req.body)
    return res.status(200).json(result)
}

const todayStatusUpdate = async (req,res) => {
    console.log("Body Status Update ",req.body)
    const result = await Activity.todayStausUpdate(req.body)
    return res.status(200).json(result)
}

const ealryCheckOutUpdate = async (req,res) => {

    const result = await Activity.earlyCheckOutStatus(req.body)
    return res.status(200).json({msg:"Successfully"})

}

const lateCheckInUpdate = async (req,res) => {
    const result = await Activity.lateCheckInStatus(req.body)
    return res.status(200).json({msg:"Successfully"})
}

const idelStartUpdate = async (req,res) => {
    console.log("Body Idel In  ",req.body)
    const result = await Activity.idelStartStatus(req.body)
    return res.status(200).json(result) 
}

const idelEndUpdate = async (req,res) => {
    console.log("Body Idel Out  ",req.body)
    const result = await Activity.idelEndStatus(req.body)
    return res.status(200).json(result)
}

const productivityUpdate = async (req,res) => {
    console.log(" Body Productivity ",req.body)
    const result = await Activity.productivityStatus(req.body)
    return res.status(200).json(result)
}

const overLimitBreakUpdate = async (req,res) => {
    console.log(" Over Limit Break Update ",req.body)
    const result = await Activity.overLimitBreakUpdate(req.body)
    return res.status(200).json(result)
}



module.exports = {
    registerGoal,
    checkOutStatusUpdate,
    breakInUpdate,
    breakOutUpdate,
    todayStatusUpdate,
    ealryCheckOutUpdate,
    lateCheckInUpdate,
    idelStartUpdate,
    idelEndUpdate,
    productivityUpdate,
    getAllActivities,
    overLimitBreakUpdate,
   
}

