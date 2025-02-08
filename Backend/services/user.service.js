'use strict';

const bcrypt = require('bcryptjs');
const { db } = require("../models")
const User = db.user;

exports.createManyUsers = async (data) => {
    const datas = [];
    for (const item of data) {
        datas.push({
            ...item,
            password: bcrypt.hashSync(item.password, 8)
        });
    }

    return User.insertMany(await Promise.all(datas));
}

exports.getUsersByQuery = async (queries) => {
    const limit = queries.limit ?? 20;
    const page = queries.page ?? 1;
    const skip = limit * (page - 1);
    const sort = queries.sort ?? { createdAt: -1 };
    const query = queries.query ?? {};

    const results = await User.
    find(query).
    skip(skip).
    limit(limit).
    sort(sort).
    populate({ path: "department", select: "name" }).
        populate({ path: "designation", select: "name" })
    const counts = await User.countDocuments(query);

    return {
        query,
        pagination: {
            perPage: limit,
            currentPage: page,
            counts,
            pages: Math.ceil(counts / limit)
        },
        data: results
    }
}

exports.createUser = async (data) => await User.create(data).then((result) => result);

exports.getUserById = async (id) => await User.findById(id).
populate({ path: "department", select: "name" }).
populate({ path: "designation", select: "name" })

exports.updateUser = async (id, data) => await User.findByIdAndUpdate(id, data)

exports.deleteUser = async (id) => await User.findByIdAndDelete(id)

exports.updateUserLeave = async (id,body) => {
    try {
        let update = {};

        // Switch statement to determine the type of leave
        switch (body.type) {
          case "fullday":
            update = { $inc: { availableLeaves: -1, leaveTaken: 1 } };
            break;
          case "halfday":
            update = { $inc: { availableLeaves: -0.5, leaveTaken: 0.5 } };
            break;
          default:
            throw new Error("Invalid leave type");
        }
        
        // Nested if-else to determine the specific type of leave
        if (body.specifictype === "paidleave") {
          update.$inc.paidLeaves = body.type === "fullday" ? 1 : 0.5;
        } else if (body.specifictype === "unpaidleave") {
          update.$inc.unpaidLeaves = body.type === "fullday" ? 1 : 0.5;
        } else {
          update.$inc.otherLeaves = body.type === "fullday" ? 1 : 0.5;
        }
        
        const result = await User.findOneAndUpdate(
          { _id: id },
          update,
          { returnOriginal: false, new: true }
        );
        console.log("Updated document:", result); // Debugging output
      } catch (error) {
        console.error("Error updating leave:", error);
        throw new Error("Not Updated");
      }
}
    
exports.updateUserLeaveAdmin = async (id,body) => {
    console.log(" AVailable leaves ",body)
    try { 
        let data = JSON.parse(body.body)
        console.log(" DATA ",data)
       let result = await User.findOneAndUpdate({_id:id},{$set:{availableLeaves:data.leaveAvailable}})
       return result
    }
    catch {
        throw Error("Not Updated")
    }
}
