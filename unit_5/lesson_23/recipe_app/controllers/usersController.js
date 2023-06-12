"use strict";

const { render } = require("ejs"),
  { check, validationResult } = require("express-validator");

const User = require("../models/user"),
  getUserParams = (body) => {
    return {
      name: {
        first: body.first,
        last: body.last,
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode,
    };
  };

module.exports = {
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index", {
      flashMessages: {
        success: "Loaded all users!",
      },
    });
  },
  new: (req, res) => {
    res.render("users/new");
  },
  // validate関数を追加
  validate: (req, res, next) => {
    // emailフィールドをサニタイズ
    req
      .sanitizeBody("email")
      .normalizeEmail({
        // 小文字に変換してからtrimで空白を除去
        all_lowcase: true,
      })
      .trim();
    check("email").isEmail();
    // zipCodeフィールドの妥当性を検証
    check("zipCode")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    // passwordフィールドの妥当性を検証
    check("password").notEmpty();

    // これまでのバリデーションの結果を集めて、
    const errors = validationResult(req);
    // もしエラーがあれば、
    if (!errors.isEmpty()) {
      const message = error.array().map((e) => e.msg);
      req.skip = true; // スキッププロパティを設定
      // エラーメッセージをフラッシュメッセージに追加
      req.flash("error", message.join(" and "));
      // リダイレクトパスをnewビューに設定
      res.locals.redirect = "/users/new/";
      next();
    } else {
      // 次のミドルウェア関数を呼び出す
      next();
    }
  },
  create: (req, res, next) => {
    if (req.skip) next();
    let userParams = getUserParams(req.body);
    User.create(userParams)
      .then((user) => {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        res.locals.redirect = "/users/new";
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: (req, res, next) => {
    // メールアドレスでユーザー1人を問い合わせる
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (user) {
          // Userモデルでパスワード比較メソッドを呼び出す
          user.passwordComparison(req.body.password).then((passwordMatch) => {
            // パスワードが一致したら
            if (passwordMatch) {
              res.locals.redirect = `/users/${user._id}`;
              req.flash(
                "success",
                `${user.fullName}'s logged in successfully!`
              );
              res.locals.user = user;
            } else {
              req.flash(
                "error",
                "Your account or password is incorrect." +
                  "Please try again or contact your system administrator!"
              );
              res.locals.redirect = "/users/login";
            }
            next();
          });
        } else {
          req.flash(
            "error",
            "Your account or password is incorrect." +
              "Please try again or contact your system administrator!"
          );
          res.locals.redirect = "/users/login";
          next();
        }
      })
      // エラーをコンソールにロギングして、次のミドルウェア（エラーハンドラ）に渡す
      .catch((error) => {
        console.error(`Error loggin in user: ${error.message}`);
        next(error);
      });
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
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
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id,
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
        console.log(`Error updating user by ID: ${error.message}`);
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
        next();
      });
  },
};
