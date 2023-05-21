"use strict";

const express = require("express"),
  app = express();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const layouts = require("express-ejs-layouts");
// MongoDBモジュールをロードする
const MongoDB = require("mongodb").MongoClient,
  dbURL = "mongodb://127.0.0.1:27017",
  dbName = "recipe_db";

// ローカルデータベースサーバーへの接続設定
MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;
  // MongoDBサーバーへの接続から、recipe_dbデータベースを取得
  let db = client.db(dbName);
  console.log("aaaa");
  db.collection("contacts")
    .find()
    .toArray((error, data) => {
      if (error) throw error;
      console.log(data);
    });

  //   db.collection("contacts").insert(
  //     {
  //       name: "Yuika Hirata",
  //       email: "****@gmail.com",
  //     },
  //     (error, db) => {
  //       if (error) throw error;
  //       console.log(db);
  //     }
  //   );
});

app.set("port", process.env.PORT || 3000);
// ejsの使用をアプリケーションに設定
app.set("view engine", "ejs");

app.use(express.static("public"));
// レイアウトモジュールの使用をアプリケーションに設定
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// ホームページの経路を作る
app.get("/", (req, res) => {
  res.send("Welcome to Confetti Cuisine!");
});
app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postSignUpForm);

// エラー処理用にミドルウェア関数を追加
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// アプリケーションがポート3000を監視するように設定
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
