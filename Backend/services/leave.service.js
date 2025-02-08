'use strict';

const { db } = require("../models")
const Leave = db.leave;
const UserService = require("../services/user.service")
exports.createManyLeaves = async (data) => {
    return Leave.insertMany(await Promise.all(data));
}

exports.getLeavesByQuery = async (queries) => {
    const limit = queries.limit ?? 20;
    const page = queries.page ?? 1;
    const skip = limit * (page - 1);
    const sort = queries.sort ?? { createdAt: -1 };
    const query = queries.query ?? [];

    const aggregate = [
        {
            $lookup: {
                from: 'users',
                let: { user: "$user" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$$user", "$_id"] }
                        }
                    },
                    { $project: { name: 1, department: 1, designation: 1 } }
                ],
                as: 'user'
            }
        },
        { $unwind: '$user' }
    ];

    if (query.length > 0) {
        aggregate.push({
            $match: {
                ...(query.length > 0 && {
                    $and: query
                })
            }
        })
    }

    const results = await Leave.
    aggregate(aggregate).
    skip(skip).
    limit(limit).
    sort(sort)
    const counts = await Leave.countDocuments(query);

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

exports.createLeave = async (data) => {
    console.log("Create leave");
    let result = [];
    const user = await UserService.getUserById(data.user)
    for(let i = 0; i <= (new Date(data.end).getTime() - new Date(data.start).getTime()) / (1000 * 60 * 60 * 24); i++) {
        let obj = { ...data };  // Use spread operator to create a copy of data
        obj.userName = user.name
        obj.start = new Date(data.start);
        obj.start.setDate(obj.start.getDate() + i);
        obj.end = obj.start;
        let finalArr = await Leave.create(obj).then((result) => result);
        console.log("Result Leave", finalArr);
        result.push(finalArr);
    }
    return result;
};


exports.getLeaveById = async (id) => await Leave.findById(id)

exports.updateLeave = async (id, data) => await Leave.findByIdAndUpdate(id, data)

exports.deleteLeave = async (id) => await Leave.findByIdAndDelete(id)
