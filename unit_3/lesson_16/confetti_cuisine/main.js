"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController"),
  layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");
mongoose.connect(
  // データベース接続を設定する
  "mongodb://localhost:27017/cofetti_cuisine",
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/subscribers", subscribersController.getAllSubscribers);

app.get("/courses", homeController.showCourses);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
