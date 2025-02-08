
const { db } = require("../models");
const { count } = require("../models/user.model");
const Timeline = db.timeline
const Activity = db.activity
exports.updateTimelineRequest = async (body) => {
    try {
        console.log("ID BODY", body);
        const id = body.id;

        // Update the Timeline document
        const result = await Timeline.findByIdAndUpdate(id, {
            status: body.status,
            updatedByAdmin: body.updatedByAdmin
        }, { new: true }); // { new: true } returns the updated document

        let fromTimeDate;
        let toTimeDate;
        // Handling fromTime and toTime
        if (body.fromTime instanceof Date) {
            fromTimeDate = body.fromTime;
            toTimeDate = body.toTime;
        } else {
            fromTimeDate = new Date(body.fromTime);
            toTimeDate = new Date(body.toTime);
        }

        const formattedFromTimeDate = fromTimeDate.toISOString().split('T')[0];

        // Find activity results matching the date
        const activityResults = await Activity.find({
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$checkInTime" } },
                    formattedFromTimeDate
                ]
            }
        }).exec();

        console.log("Activity Results Found", activityResults);

        // Helper function to update productivity filled
        const updateProductivityFilled = (productivityHistory, fromTimeDate, toTimeDate, name) => {
            for (let i = 0; i < productivityHistory.length; i++) {
                let element = productivityHistory[i];
                let arr = element.slotHours.split('-');
                let slotStartHour = parseInt(arr[0]);
                let slotEndHour = parseInt(arr[2]);
                let fromHour = fromTimeDate.getHours();
                let toHour = toTimeDate.getHours();
                console.log("SLOT Range", slotStartHour, slotEndHour, fromHour, toHour);

                // Check if the current slot falls within the given time range
                if (slotStartHour >= fromHour && slotEndHour >= toHour) {
                    console.log("Slot inside range");

                    if (fromHour === toHour) {
                        // Same hour: directly calculate the minutes
                        if (name === "Private") {
                            element.productivityFilled += Math.floor((toTimeDate - fromTimeDate) / (1000 * 60));
                            element.totalSlotFilled += Math.floor((toTimeDate - fromTimeDate) / (1000 * 60));
                        } else {
                            element.productivityFilled += Math.floor((toTimeDate - fromTimeDate) / (1000 * 60));
                        }
                    } else {
                        if (slotStartHour === fromHour && slotStartHour < toHour) {
                            // First hour slot: calculate till the end of the hour
                            let middlePart = new Date(fromTimeDate);
                            middlePart.setMinutes(59);
                            middlePart.setSeconds(59);
                            if (name === "Private") {
                                element.productivityFilled += Math.floor((middlePart - fromTimeDate) / (1000 * 60));
                                element.totalSlotFilled += Math.floor((middlePart - fromTimeDate) / (1000 * 60));
                            } else {
                                element.productivityFilled += Math.floor((middlePart - fromTimeDate) / (1000 * 60));
                            }
                        } else if (slotStartHour >= fromHour && slotEndHour <= toHour) {
                            // Full hour slot in between: add 60 minutes
                            if (name === "Private") {
                                element.productivityFilled += 60;
                                element.totalSlotFilled += 60;
                            } else {
                                element.productivityFilled += 60;
                            }
                        } else if (slotStartHour === toHour) {
                            // Last hour slot: calculate from the start of the hour
                            let middlePart = new Date(toTimeDate);
                            middlePart.setMinutes(0);
                            middlePart.setSeconds(0);
                            if (name === "Private") {
                                element.productivityFilled += Math.floor((toTimeDate - middlePart) / (1000 * 60));
                                element.totalSlotFilled += Math.floor((toTimeDate - middlePart) / (1000 * 60));
                            } else {
                                element.productivityFilled += Math.floor((toTimeDate - middlePart) / (1000 * 60));
                            }
                        }
                    }
                }
            }
        };

        // Iterate through each activity result
        for (let activityResult of activityResults) {
            switch (body.requestFrom) {
                case "Idel":
                    let count = activityResult.idelHistory.findIndex((element) => {
                       
                        return new Date(element.idelStartedTime).setMilliseconds(0) <= fromTimeDate.setMilliseconds(0) && toTimeDate.setMilliseconds(0) <= new Date(element.idelEndedTime).setMilliseconds(0);
                    });

                    let requestTimeLine = {};

                    // Remove the element if found and update the data
                    if (count !== -1) {
                        console.log("REMOVE IDEL", fromTimeDate, toTimeDate, new Date(activityResult.idelHistory[count].idelStartedTime), new Date(activityResult.idelHistory[count].idelEndedTime));

                        const fromTimeDateWithoutTime = new Date(fromTimeDate.setMilliseconds(0));
                        const toTimeDateWithoutTime = new Date(toTimeDate.setMilliseconds(0));

                        const idelStartedTimeWithoutTime = new Date(new Date(activityResult.idelHistory[count].idelStartedTime).setMilliseconds(0));
                        const idelEndedTimeWithoutTime = new Date(new Date(activityResult.idelHistory[count].idelEndedTime).setMilliseconds(0));

                        if (idelStartedTimeWithoutTime.getTime() === fromTimeDateWithoutTime.getTime() &&
                            idelEndedTimeWithoutTime.getTime() === toTimeDateWithoutTime.getTime()) {
                            console.log("Removing the idel entry");
                            requestTimeLine = {
                                startTimeline: activityResult.idelHistory[count].idelStartedTime,
                                endTimeline: activityResult.idelHistory[count].idelEndedTime
                            };
                            activityResult.idelHistory.splice(count, 1);
                        } else {
                            requestTimeLine = {
                                startTimeline: fromTimeDate,
                                endTimeline: toTimeDate
                            };
                         

                            if(idelStartedTimeWithoutTime.setSeconds(0) === fromTimeDateWithoutTime.setSeconds(0)) {

                                console.log("Best one")
                                activityResult.idelHistory[count].idelStartedTime = toTimeDateWithoutTime;

                                
                            } else if (idelEndedTimeWithoutTime.setSeconds(0)=== toTimeDateWithoutTime.setSeconds(0)) {
                                console.log("Before ", activityResult.idelHistory[count].idelEndedTime,
                                    activityResult.idelHistory[count].idelSlotEndedTime,fromTimeDate)

                                    const tempRequest = {
                                        idelStartedTime: activityResult.idelHistory[count].idelStartedTime,
                                        idelEndedTime: fromTimeDate, 
                                        idelSlotEndedTime: fromTimeDate + 18000, 
                                    }
                                    console.log("Temp Request ",tempRequest)
                                    activityResult.idelHistory.splice(count, 1);
                                    activityResult.idelHistory.push(tempRequest);
                                console.log("After ", activityResult.idelHistory[count].idelEndedTime,
                                    activityResult.idelHistory[count].idelSlotEndedTime,fromTimeDate)
                            }
                            // activityResult.markModified('idelHistory');
                        }

                        activityResult.timelineRequestHistory.push(requestTimeLine);
                    }

                    updateProductivityFilled(activityResult.productivityHistory, fromTimeDate, toTimeDate, "Idel");
                    break;

                case "Private":
                    console.log(" Break Hisyory ",fromTimeDate,toTimeDate)
                    let countPrivate = activityResult.breaksHistory.findIndex((element) => {
                        return new Date(element.breakStartedTime).setMilliseconds(0)  <= fromTimeDate.setMilliseconds(0) && toTimeDate.setMilliseconds(0) <= new Date(element.breakEndedTime).setMilliseconds(0);
                    });

                    let requestTimeLineBreak = {};

                    // Remove the element if found and update the data
                    if (countPrivate !== -1) {
                        const fromTimeDateWithoutTime = new Date(fromTimeDate.setMilliseconds(0));
                        const toTimeDateWithoutTime = new Date(toTimeDate.setMilliseconds(0));

                        const breakStartedTimeWithoutTime = new Date(new Date(activityResult.breaksHistory[countPrivate].breakStartedTime).setMilliseconds(0));
                        const breakEndedTimeWithoutTime = new Date(new Date(activityResult.breaksHistory[countPrivate].breakEndedTime).setMilliseconds(0));
                        console.log("REMOVE Private Count");

                        if (breakStartedTimeWithoutTime.getTime() === fromTimeDateWithoutTime.getTime() &&
                        breakEndedTimeWithoutTime.getTime() === toTimeDateWithoutTime.getTime()) {
                        console.log("Removing the Private entry");
                        requestTimeLineBreak = {
                            startTimeline: activityResult.breaksHistory[countPrivate].breakStartedTime,
                            endTimeline: activityResult.breaksHistory[countPrivate].breakEndedTime
                        };
                        activityResult.breaksHistory.splice(countPrivate, 1);
                        } else {
                            requestTimeLineBreak = {
                                startTimeline: fromTimeDate,
                                endTimeline: toTimeDate
                            };
                            if(breakStartedTimeWithoutTime.setSeconds(0) === fromTimeDateWithoutTime.setSeconds(0)) {

                                console.log("Best one")
                                activityResult.breaksHistory[countPrivate].breakStartedTime = toTimeDateWithoutTime;

                                
                            } else if (breakEndedTimeWithoutTime.setSeconds(0)=== toTimeDateWithoutTime.setSeconds(0)) {
                                console.log("Before ", activityResult.breaksHistory[countPrivate].breakEndedTime,
                                    activityResult.breaksHistory[countPrivate].breakStartedTime)

                                    const tempRequest = {
                                        breakStartedTime: activityResult.breaksHistory[countPrivate].breakStartedTime,
                                        breakEndedTime: fromTimeDate, 
                                        
                                    }
                                    console.log("Temp Request ",tempRequest)
                                    activityResult.breaksHistory.splice(countPrivate, 1);
                                    activityResult.breaksHistory.push(tempRequest);
                                   
                                console.log("After ", activityResult.breaksHistory[countPrivate].breakEndedTime,
                                    activityResult.breaksHistory[countPrivate].breakStartedTime)
                            }
                            // activityResult.markModified('idelHistory');
                            // activityResult.breaksHistory.splice(countPrivate, 1);
                        }
                        activityResult.timelineRequestHistory.push(requestTimeLineBreak);

                    }

                    updateProductivityFilled(activityResult.productivityHistory, fromTimeDate, toTimeDate, "Private");
                    break;
            }

            // console.log(" Activity Before updating ",activityResult.idelHistory[0])
            
            // Save the updated activity result to the database
             await activityResult.save();
            
        }

        return result;
    } catch (error) {
        console.error("Error: ", error);
        return new Error("Error occurred while updating the timeline.");
    }
};



exports.createTimelineRequest = async (body) => {
      try {
        
        const result = await Timeline.create(body)
        console.log("Request Time Line Body ",result)
        return result
      }
      catch {
        return new Error("Error")
      }
}

exports.getTimelineRequests = async () => {
        try {
          const result = await Timeline.find()
          return result
        }
        catch {
          return new Error("Error")
        }
}

exports.getTimelineRequestsByDate = async (data, id) => {
    try {
        // Convert input into a Date object
        const inputDate = new Date(data);

        // Get the start and end of the given date (ignoring time)
        const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0)); // 00:00:00
        const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999)); // 23:59:59

        // Query to filter by date and user ID
        const result = await Timeline.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }, // Match date range
            userId: id // Match user ID
        });

        return { data: result };
    } catch (error) {
        return new Error("Error fetching data");
    }
};



exports.deleteTimelineRequest = async (id) => {
    try {
        const result = await Timeline.findByIdAndDelete(id)
        return {data : result}
      }
      catch {
        return new Error("Error")
      }
}