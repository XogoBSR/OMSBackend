'use strict';

const { db } = require("../models")
const Attendance = db.attendance;

exports.createManyAttendances = async (data) => {
    return Attendance.insertMany(await Promise.all(data));
}

exports.getAttendancesByQuery = async (queries) => {

    const limit = queries.limit ?? 20;
    const page = queries.page ?? 1;
    const skip = limit * (page - 1);
    const sort = queries.sort ?? { createdAt: -1 };
    const query = queries.query ?? [];

    console.log("LImit Page ",limit,page,skip,sort,query)

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

    const results = await Attendance.
    aggregate(aggregate).
    skip(skip).
    limit(limit).
    sort(sort)
    const counts = results.length;
    console.log("Main Data ",results)
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

exports.createAttendance = async (data) => await Attendance.create(data).then((result) => result);

exports.getAttendanceById = async (id) => await Attendance.findById(id)

exports.updateAttendance = async (id, data) => {
    
    console.warn("Updated Attandance ",data)
   const result =  await Attendance.findById(id)
   result.checkOut = data.checkOut
   await result.save() 
   return result
}

exports.deleteAttendance = async (id) => await Attendance.findByIdAndDelete(id)


exports.getAttendanceByMonth = async (data,queries) => {

    let { startDate, endDate } = data;
    [startDate, endDate] = [new Date(startDate), new Date(endDate)];
    const limit = queries.limit ?? 20;
    const page = queries.page ?? 1;
    const skip = limit * (page - 1);
    const sort = queries.sort ?? { createdAt: -1 };
    const query = queries.query ?? [];
    
    console.log(" Start Date ",startDate,endDate)
    const aggregate = [
        {
            $match: {
                $and: [
                    {
                        checkIn: { $gte: startDate }
                    },
                    {
                        checkIn: { $lte: endDate }
                    }
                ]
            }
        }
    ];
      
    const result = await Attendance.aggregate(aggregate) 
    const counts = result.length;
    console.log(" Aggregate Result ",result,limit,page,counts,Math.ceil(counts / limit))
    return {
        data:result,
        pagination: {
        perPage: limit,
        currentPage: page,
        counts,
        pages: Math.ceil(counts / limit)
    }}
    
}
