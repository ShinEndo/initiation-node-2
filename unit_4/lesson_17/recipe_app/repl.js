const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");
const subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

// すべての購読者とコースを削除
Subscriber.remove({});
Course.remove({});

Subscriber.create({
  name: "Jon",
  email: "jon-san@gmail.com",
  zipCode: "12345",
});

Subscriber.findOne({ name: "Jon" }).then((result) => {
  subscriber = result;
  console.log(subscriber.getInfo());
});

// プロミスチェインの外側で2つの変数を準備
let testCourse, testSubscriber;
// 新しいインスタンスを作る
Course.create({
  title: "Tomato Land",
  description: "Locally farmed tomatoes only",
  zipCode: 12345,
  items: ["cherry", "heirloom"],
}).then((course) => (testCourse = course));

// 購読者を探す
Subscriber.findOne({}).then((subscriber) => (testSubscriber = subscriber));

// testCourseを、testSubscriberのコース配列にプッシュ
testSubscriber.courses.push(testCourse._id);

// 購読者モデルのインスタンスを再び保存
testSubscriber.save();
// populateを使って購読者モデルにコースを記入する
Subscriber.populate(testSubscriber, "courses").then((subscriber) =>
  console.log(subscriber)
);
