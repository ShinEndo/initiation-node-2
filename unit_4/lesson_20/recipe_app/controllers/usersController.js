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
  // フォームをレンダリングするnewアクションの追加
  new: (req, res) => {
    res.render("users/new");
  },
  // ユーザーをデータベースに保存するcreateアクションを追加
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };

    // フォームのパラメータでユーザーを作る
    User.create(userParams)
      .then((user) => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.error(`Error saving user: ${error.message}`);
        next(error);
      });
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        // レスポンスオブジェクト経由でユーザーを次のミドルウェア関数に渡す
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  // editのアクション
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((errror) => {
        console.log(`Error fetching user by ID: ${userId}`);
        next(error);
      });
  },
  // 更新のアクション
  update: (req, res, next) => {
    const userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode,
      };
    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.error(`Error updating user by ID: ${userId}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next(error);
      });
  },
  // ビューのレンダリングは、redirectViewで別に行う
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
