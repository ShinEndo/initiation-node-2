const mongoose = require("mongoose"),
  { Schema } = mongoose,
  Subscriber = require("./subscriber"),
  userSchema = new Schema(
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
        unique: true,
      },
      zipCode: {
        type: String,
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
      subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber",
      },
    },
    {
      timestamps: true,
    }
  );

// 仮想属性の追加
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// 購読者にリンクするpre('save')フックを追加
userSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email,
    })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
