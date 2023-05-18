"use strict";

// subscriberモジュールをロードする
const Subscriber = require("../models/subscriber");

// データを次のミドルウェア関数に渡すため、getAllSubscribersをエクスポートする
exports.getAllSubscribers = (req, res, next) => {
  // findによって、Subscriberモデルに対するクエリを発行
  Subscriber.find({}, (error, subscribers) => {
    // エラーは次のミドルウェア関数に渡す
    if (error) next(error);
    // MongoDBから返されたデータをrequestオブジェクトに設定する
    req.data = subscribers;
    // 次のミドルウェア関数に進む
    next();
  });
};

// contactページをレンダリングするアクションを追加
exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};

// 購読者情報を保存するアクションを追加
exports.saveSubscriber = (req, res) => {
  // 新しいSubscriberを作成
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  });
  // 新しいSubscriberを保存
  newSubscriber
    .save()
    .then((data) => {
      res.render("thanks");
    })
    .catch((error) => res.send(error));
};
