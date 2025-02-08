const { db } = require("../models");
const Activity = db.activity;
const Leaves = db.leave;
const moment = require("moment");


exports.createTodayGoal = async (req) => {
  const { body } = req;
  let result = await Activity.create({
    user: req.user,
    todaysGoal: body.todaysGoal,
    lateCheckInStatus: checkInStatus(),
    checkInTime: Date.now(),
  });

  let workObj = {
    startWorkTime : Date.now()
  }
  const currentHour = new Date().getHours();
    const keyName = `${currentHour}-to-${currentHour + 1}`;
    // Initialize productivityHistory if it doesn't exist
    if (!result.productivityHistory) {
      result.productivityHistory = [];
    }
    // Check if the key exists in the productivityHistory
    let entry = result.productivityHistory.find(
      (obj) => obj.slotHours === keyName
    );
    if (!entry) {
      // Add new entry if key does not exist
      result.productivityHistory.push({
        slotHours: keyName,
        totalSlotFilled: 0,
        productivityFilled: 0,
      });
    }
 
  result.productivityHoverHistory.push(workObj)
  await result.save()
  return result;
};

exports.getAllActivities = async (id) => {
  let result = await Activity.find({user:id});
  console.log("Activity FInd ",result)
  return result;
};

exports.checkOutStatusUpdate = async (_id) => {
  try {
    let result = await Activity.findById(_id);
    if (!result) {
      throw new Error(`Activity with ID ${_id} not found`);
    }
    result.checkOutTime = Date.now();
    console.warn("Total Hours: ", result.totalWorkingTime);
    result.earlyCheckOutStatus = checkOutStatus(result.totalWorkingTime);
    let leaveResult = await Leaves.findOne({start:Date.now() ,status:1})
    console.log("Check out Leave Result ",leaveResult)

    await result.save();
    return result;
  } catch (e) {
    console.error("Error occurred: ", e); // Log the error with more detail
    return new Error("Error occurred: " + e.message);
  }
};

exports.breakInStatusUpdate = async (body) => {
  console.log("Lunch status in update ", body);

  try {
    const currentTime = Date.now();

    const result = await Activity.findById(body._id) 
    result.productivityHoverHistory[result.productivityHoverHistory.length - 1].endWorkTime = currentTime
    result.breakStatus = true
    result.breaksHistory.push({
            breakType: body.type,
            breakStartedTime: currentTime,
            breakDescription: breakDescriptionFun(body.type, body.description),
    })
    await result.save()
    return result;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Error in updating break status");
  }
};

exports.breakOutStatusUpdate = async (body) => {
  console.log("Lunch status out update ", body);
  try {
    // Find the activity by ID
    let result = await Activity.findById(body._id);
    if (!result) {
      throw new Error("Activity not found");
    }

    // Update break end time and calculate break duration
    const breakEndTime = Date.now();
    const breakHistory = result.breaksHistory[result.breaksHistory.length - 1];
    breakHistory.breakEndedTime = breakEndTime;

    const breakTime = (breakEndTime - breakHistory.breakStartedTime) / 1000 / 60;
    breakHistory.totalLunchTime = breakTime;

    // Update productivity hover history
    result.productivityHoverHistory.push({ startWorkTime: breakEndTime });

    // Update break status and save the result
    result.breakStatus = false;
    result.overLimitBreakStatus = breakOutStatus(breakTime);

    await result.save();
    return result;
  } catch (error) {
    console.error("Error updating break out status:", error);
    throw new Error("Error updating break out status");
  }
};


exports.todayStausUpdate = async (body) => {
  console.log("Status out update ", body);
  try {
    let result = await Activity.findById(body._id);
    result.workStatus = body.reasone;

    await result.save();
    return result;
  } catch {
    return new Error("Errror ");
  }
};

exports.lateCheckInStatus = async (body) => {
  console.log("Late Check in update ", body);
  try {
    let result = await Activity.findById(body._id);
    result.lateCheckInDiscription = body.description;
    await result.save();
    return result;
  } catch {
    return new Error("Errror ");
  }
};

exports.earlyCheckOutStatus = async (body) => {
  console.log("Early Check out update ", body);
  try {
    let result = await Activity.findById(body._id);
    result.earlyCheckOutDiscription = body.description;
    await result.save();
    return result;
  } catch {
    return new Error("Errror ");
  }
};

exports.idelStartStatus = async (body) => {
   console.log("Idel Started");
  try {
    let result = await Activity.findById(body._id);
    if (result?.idelHistory.length > 0) {
      if (!result.idelHistory[result.idelHistory.length - 1]?.idelEndedTime) {
        return;
      }
    }
    result.productivityHistory[
      result.productivityHistory.length - 1
    ].productivityFilled -= 3;

    console.log("Idel Started ", result.productivityHistory[
      result.productivityHistory.length - 1
    ].productivityFilled);
    let obj = {
      idelStartedTime: Date.now() - 180000,
    };

    result.productivityHoverHistory[result.productivityHoverHistory.length - 1].endWorkTime = obj.idelStartedTime;

    result.idelHistory.push(obj);
    await result.save();
    return result;
  } catch {
    return new Error("Errror ");
  }
};

exports.idelEndStatus = async (body) => {
  console.log("Idel Ended");
  try {
    let result = await Activity.findById(body._id);
    let obj = {
      idelEndedTime: new Date().setMilliseconds(0),
    };
    result.idelHistory[result.idelHistory.length - 1].idelEndedTime =
      obj.idelEndedTime;
    result.idelHistory[result.idelHistory.length - 1].idelSlotEndedTime =
      obj.idelEndedTime + 180000;
      result.idelHistory[result.idelHistory.length - 1].idelSlotEndedTime.setMilliseconds(0)
   
    let workObj = {
      startWorkTime : Date.now()
    }
    result.productivityHoverHistory.push(workObj)

    await result.save();
    return result;
  } catch {
    return new Error("Errror ");
  }
};

exports.productivityStatus = async (body) => {
  try {
    // Fetch the document by ID
    let result = await Activity.findById(body._id);

    if (!result) {
      throw new Error("Activity not found");
    }

    console.warn("Productivity status", body);

    const currentHour = new Date().getHours();
    const keyName = `${currentHour}-to-${currentHour + 1}`;
    // Initialize productivityHistory if it doesn't exist
    if (!result.productivityHistory) {
      result.productivityHistory = [];
    }
    // Check if the key exists in the productivityHistory
    let entry = result.productivityHistory.find(
      (obj) => obj.slotHours === keyName
    );
    if (!entry) {
      // Add new entry if key does not exist
      result.productivityHistory.push({
        slotHours: keyName,
        totalSlotFilled: body.totalSlot,
        productivityFilled: body.filledSlot,
      });
    } else {
      // Update existing entry
      entry.totalSlotFilled += body.totalSlot;
      entry.productivityFilled += body.filledSlot;
    }
    result.totalWorkingTime += 1;
    console.warn("Total Working time ", result.totalWorkingTime);
    // Save the updated document
    await result.save();
    return result;
  } catch (error) {
    console.error("Error in productivityStatus:", error);
    throw error;
  }
};

exports.overLimitBreakUpdate = async (body) => {
  try {
    console.log("OVER limit break", body);
    let result = await Activity.findById(body._id);

    result.breaksHistory[
      result.breaksHistory.length - 1
    ].overLimitBreakDescription = body.description;
    result.overLimitBreakStatus = false;
    await result.save();
    return result;
  } catch {
    return new Error("Errror ");
  }
};

const checkInStatus = () => {
  const today = new Date();
  const checkIn930AM = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    10,
    30
  );
  if (checkIn930AM < Date.now()) {
    return true;
  }
  return false;
};

const checkOutStatus = (totalHours) => {
  
  const diffInMinutes = Math.floor(totalHours / (1000 * 60));

  console.warn("Chekc out status ", totalHours);
  if (diffInMinutes < 8.5) {
    return true;
  }
  return false;
};

function breakDescriptionFun(breakType, reasone = "") {
  switch (breakType) {
    case "teaBreak":
      return "Tea break";
    case "lunchBreak":
      return "Lunch Break";
    case "other":
      return reasone;
  }
}

const breakOutStatus = (tempTime) => {
  if (tempTime > 30) {
    return true;
  }
  return false;
};
