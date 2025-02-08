'use strict';
const Timeline  = require("../services/timeline.service");

const createTimelineRequest = async (req,res) => {
    const result = await Timeline.createTimelineRequest(req.body)
    console.log("Result got ",result)
    return res.status(200).json(result)
}

const updateTimelineRequest = async (req,res) => {
    console.log(" UPDATE TIMELINE REQUEST ",req.body)
    const result = await Timeline.updateTimelineRequest(req.body)
    return res.status(200).json(result)
}

const getTimelineRequests = async (req,res) => {
    const result = await Timeline.getTimelineRequests()
    return res.status(200).json(result)
}

const getTimelineRequestByDate = async (req,res) => {
    const {data,id} = req.params
    const result = await Timeline.getTimelineRequestsByDate(data,id)
    return res.status(200).json(result)
}

const deleteTimelineRequest = async (req,res) => {
    const data = req.params.date
    const result = await Timeline.getTimelineRequestsByDate(data)
    return res.status(200).json(result)
}

module.exports = {
    updateTimelineRequest,
    createTimelineRequest,
    getTimelineRequests,
    getTimelineRequestByDate,
    deleteTimelineRequest
}

