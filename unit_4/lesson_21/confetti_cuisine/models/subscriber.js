"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose,
  subscriberSchema = new Schema(
    {
      // スキーマにプロパティを追加
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
      // 複数のコースを関連付ける
      courses: [
        {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

// インスタンスメソッドのgetinfoを追加
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Subscriberモデルをエクスポート
module.exports = mongoose.model("Subscriber", subscriberSchema);
