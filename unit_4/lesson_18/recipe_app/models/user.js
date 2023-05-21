const mongoose = require("mongoose"),
  { Schema } = mongoose;

// ユーザのスキーマを作る
const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
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
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    subscribedAccouont: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
    },
  },
  {
    timeStamps: true,
  }
);

// ユーザーのフルネームを取得する仮想属性の追加
userSchema.virtual("fullname").get(function () {
  return `${this.name.first}${this.name.last}`;
});

userSchema.virtual("lengthname").get(function () {
  return `${this.fullname.length}`;
});

module.exports = mongoose.model("User", userSchema);
