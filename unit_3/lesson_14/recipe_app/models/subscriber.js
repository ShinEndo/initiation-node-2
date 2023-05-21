// mongooseをロード
const mongoose = require("mongoose"),
  subscriberSchema = (subscribeSchema = mongoose.Schema({
    name: String,
    email: String,
    zipCode: Number,
  }));

// subscriberをエクスポートする
module.exports = mongoose.model("Subscriber", subscriberSchema);
