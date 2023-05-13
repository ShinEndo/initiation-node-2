const port = 3000,
  http = require("http"),
  httpStatus = require("http-status-codes"),
  app = http.createServer();

app.on("request", (req, res) => {
  let body = []; // チャンクを格納する配列を作成
  req.on("data", (bodyData) => {
    // データを別のコールバック関数で処理
    body.push(bodyData);
  });

  req.on("end", () => {
    body = Buffer.concat(body).toString(); // body配列を文字列テキストに変換
    console.log(`Request Body Contents: ${body}`);
  });

  // JavaScriptオブジェクトを文字列に変換する
  const getJSONString = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  console.log(`Method: ${getJSONString(req.method)}`);
  console.log(`URL: ${getJSONString(req.url)}`);
  console.log(`Headers: ${getJSONString(req.headers)}`);

  // レスポンスを準備
  res.writeHead(httpStatus.OK, {
    "Content-Type": "text/html",
  });

  // 「このメッセージが画面に現れます」
  let responseMessage = "<h1>This will sho on the screen.</h1>";
  // HTMLでレスポンスする
  res.end(responseMessage);
});

app.listen(port);
console.log(`This server has started and is listening on port number: ${port}`);
