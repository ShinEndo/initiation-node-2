const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");

// データベース接続を設定
mongoose.connect("mongodb://localhost:27017/recipe_db", { useNewParser: true });
mongoose.connection;

const contacts = [
  {
    name: "Shin Endo",
    email: "shinendo@gmail.com",
    zipCode: 10016,
  },
  {
    name: "Yuika Hirata",
    email: "yuikahirata@gmail.com",
    zipCode: 10017,
  },
  {
    name: "Taro Yamada",
    email: "taroyamada@gmail.com",
    zipCode: 10018,
  },
];

// 既存のデータを、すべて削除する
Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });

let commands = [];

// Subscriperオブジェクトをループしてプロミスを作る
contacts.forEach((c) => {
  commands.push(Subscriber.create({ name: c.name, email: c.email }));
});

// プロミス解決後に、ログで確認する
Promise.all(commands)
  .then((r) => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch((error) => console.log(`ERROR: ${error}`));
