const mongoose = require("mongoose"),
  { Schema } = mongoose;
const Subscriber = require("./subscriber");

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

// pre('save') hookを設定。コールバックにfunctionキーワードを使う
userSchema.pre("save", function (next) {
  let user = this;
  // すでに購読者との関連があるかチェック
  if (user.subscribedAccouont === undefined) {
    // 購読者1人を探すクエリ
    Subscriber.findOne({
      email: user.email,
    })
      .then((subscriber) => {
        // ユーザーと購読者のアカウントを結びつける
        user.subscribedAccouont = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        // エラーがあれば次のミドルウェア関数に渡す
        next(error);
      });
  } else {
    // ユーザーに既存の関連があれば次の関数を呼び出す
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
