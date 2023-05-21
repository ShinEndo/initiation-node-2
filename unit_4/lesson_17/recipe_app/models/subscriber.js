"use strict";

const mongoose = require("mongoose"),
  subscriberSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  });

// 購読者のフルネームを取得するインスタンスメソッドを追加
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};
// 同じZipコードを持つ購読者を見つけるインスタンスメソッドを追加
subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model("subscriber").find({ zipCode: this.zipCode }).exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);
