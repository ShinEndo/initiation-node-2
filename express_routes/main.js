const port = 3000,
  express = require("express"),
  app = express(),
  homeController = require("./controllers/homeControllers");

// ミドルウェア関数を定義
app.use((req, res, next) => {
  // リクエストパスをログに出す
  console.log(`request made to: ${req.url}`);
  next();
});

// URLエンコードされたデータを解析する
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// ホームページ用に新しいPOST経路を作る
app.post("/", homeController.logRequestPaths);

// URLパラメータを取得する経路を追加
app.get("/items/:vegetable", homeController.sendReqParam);

// sign_up用のパスを作成
app.post("/sign_up", homeController.userSignUpProcessor);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
