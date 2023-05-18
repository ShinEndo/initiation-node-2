"use strict";

const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

var myQuery = Subscriber.findOne({
  name: "Jon Wexler",
}).where("email", /wexler/);

myQuery.exec((error, data) => {
  if (data) console.log(data.name);
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(homeController.logRequestPaths);

// リクエストを、getAllSubscribers関数に渡す
app.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  (req, res, next) => {
    // reqestオブジェクトからデータをログに出す
    console.log(req.data);
    // データをブラウザのウィンドウに表示する
    res.render("subscribers", { subscribers: req.data });
  }
);

app.get("/name", homeController.respondWithName);
app.get("/items/:vegetable", homeController.sendReqParam);

// 購読ページ用のGETルートを変更
app.get("/contact", subscribersController.getSubscriptionPage);
// 購読データを処理するPOSTルートを追加
app.post("/subscribe", subscribersController.saveSubscriber);

app.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
