"use strict";

// ユーザーモデルをロードする
const User = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then((users) => {
        // ユーザーデータをレスポンスに格納し、次のミドルウェア関数を呼び出す
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.messages}`);
        next(error);
      });
  },
  // 別のアクションでレンダリングを行う
  indexView: (req, res) => {
    res.render("users/index");
  },
};
