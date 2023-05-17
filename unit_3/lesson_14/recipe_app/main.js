"use strict";

const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts");

// mongooseをロード
const mongoose = require("mongoose");
// データベースを接続
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
// データベースをdb変数に代入
const db = mongoose.connection;
// データベース接続時のメッセージをログに出力する
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// mongoose.Schemaで新しいスキーマを作る
const subscribeSchema = mongoose.Schema({
  name: String,
  email: String,
  zipCode: Number,
});
const Subscriber = mongoose.model("Subscriber", subscribeSchema);

// 新しいSubscriberを実体化する
const subscriber1 = new Subscriber({
  name: "Shin Endo",
  email: "e**3****@gmail.com",
});
// Subscriberをデータベースに保存する
subscriber1
  .save()
  .then((savedDocument) => {
    // 保存したドキュメントをログに出す
    console.log(savedDocument);
  })
  .catch((error) => {
    // エラーがあればミドルウェア関数に渡す
    if (error) console.log(error);
  });

Subscriber.create({
  name: "Shin Endo",
  email: "***3***e@gmail.com",
})
  .then((savedDocument) => {
    console.log(savedDocument);
  })
  .catch((error) => {
    if (error) console.log(error);
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

app.get("/name", homeController.respondWithName);
app.get("/items/:vegetable", homeController.sendReqParam);

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
