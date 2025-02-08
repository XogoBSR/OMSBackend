"use strict";

const mongoose = require("mongoose");

const breakHistoryObj = new mongoose.Schema({
  breakType: {
    type: String,
  },
  breakStartedTime: {
    type: Date,
  },
  breakEndedTime: {
    type: Date,
  },
  breakLastedTime: {
    type: Date,
  },
  totalLunchTime: { type: Date },
  overLimitBreakDescription: { type: String },
  breakDescription: { type: String },
});

const idelHistoryObj = new mongoose.Schema({
  idelStartedTime: {
    type: Date,
  },
  idelEndedTime: {
    type: Date,
  },
  idelSlotEndedTime: {
    type: Date,
  },
});

const productivitySlotObj = new mongoose.Schema({
  startWorkTime: {
    type: Date,
  },
  endWorkTime: {
    type: Date,
  },
});

const timelineRequestObj = new mongoose.Schema({
    startTimeline: {
      type: Date
    },
    endTimeline: {
      type: Date
    },
    requestName: {
      type: String
    },
    status: {
      type: Number,
      default: 0
    },
    updateByAdmin: {
      type:Boolean,
      default: false

    }

})

const productHistoryObj = new mongoose.Schema({
  totalSlotFilled: {
    type: Number,
  },
  productivityFilled: {
    type: Number,
  },
  slotHours: {
    type: String,
  },
});

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    todaysGoal: {
      type: String,
    },
    lateCheckInStatus: {
      type: Boolean,
      default: false,
    },
    earlyCheckOutStatus: {
      type: Boolean,
      default: false,
    },
    earlyCheckOutDiscription: {
      type: String,
    },
    lateCheckInDiscription: {
      type: String,
    },
    overLimitBreakStatus: {
      type: Boolean,
      default: false,
    },
    breaksHistory: [breakHistoryObj],
    timelineRequestHistory: [timelineRequestObj],
    idelHistory: [idelHistoryObj],
    productivityHistory: [productHistoryObj],
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    workStatus: {
      type: String,
    },
    totalWorkingTime: {
      type: Number,
      default: 0,
    },
    breakStatus: {
      type: Boolean,
      default: false,
    },
    productivityHoverHistory : [productivitySlotObj]
  },
  { timestamps: true }
);

const Activity = mongoose.model("activity", ActivitySchema);

module.exports = Activity;
