// subscriberモデルをロードする
const Subscriber = require("../models/subscriber");

// すべての購読者情報を取り出す
exports.getAllSubscribers = (req, res) => {
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.render("subscribers", {
        subscribers: subscribers,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log("promise complete");
    });
};

// contactページを表示する
exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};

// 購読者情報を保存する
exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  });
  newSubscriber
    .save()
    .then(() => {
      res.render("thanks");
    })
    .catch((error) => {
      res.send(error);
    });
};
