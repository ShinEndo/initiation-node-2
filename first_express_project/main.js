const port = 3000,
  express = require("express"),
  app = express();

// ホームページのGET経路を設定
app
  .get("/", (req, res) => {
    console.log(req.params);
    console.log(req.body);
    console.log(req.url);
    console.log(req.query);

    // サーバーからクライアントへのレスポンスを発行
    res.send("Hello, Universe!");
  })
  .listen(port, () => {
    console.log(
      `The Express.js server has started and is listening on port nuber:${port}`
    );
  });
