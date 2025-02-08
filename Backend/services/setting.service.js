'use strict';

const { db } = require("../models")
const Setting = db.setting;

exports.createSetting = async (data) => {
    return Setting.insertMany(await Promise.all(data));
}

exports.getSetting = async () => await Setting.find();

exports.updateSetting = async (id, data) => await Setting.findByIdAndUpdate(id, data);

exports.addCompamnyLeave = async (id,data) => {
    let result = await Setting.findById(id)
    try { 
        console.log(" BODY ",data.body)
        const body = JSON.parse(data.body)
        // Check if leaveDate already exists in the companyLeaveArr
        const exists = result.companyLeaveArr.some(leave => leave.leaveDate.getTime() === new Date(body["leaveDate"]).getTime());
        if (exists) {
            throw new Error("Duplicate leaveDate detected");
        }
        result.companyLeaveArr.push({
             leaveDate:body["leaveDate"],
            description:body["description"]
        })
        return await result.save()
    }
    catch {
        console.log(" ERROR ERROR ")
    }
}

exports.deleteCompanyLeaves = async (id) => {
    try {
        let result = await Setting.findById(id);
        if (!result) {
            throw new Error("Document not found");
        }
        console.log("Before clearing: ", result.companyLeaveArr);
        result.companyLeaveArr = [];
        console.log("After clearing: ", result.companyLeaveArr);
        // Save the document
        await result.save();
        let updatedResult = await Setting.findById(id);
        console.log("After saving: ", updatedResult.companyLeaveArr);

        return updatedResult;
    } catch (error) {
        console.error("ERROR ERROR:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};
