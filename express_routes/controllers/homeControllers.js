// ある経路に固有のリクエストを扱う関数を作る
exports.sendReqParam = (req, res) => {
  let veg = req.params.vegetable;
  res.send(`This is the page for ${veg}`);
};

exports.logRequestPaths = (req, res) => {
  console.log(req.body); // リクエスト本文をロギング
  console.log(req.query);
  res.send("POST Successful!");
};

exports.userSignUpProcessor = (req, res) => {
  console.log(req.body);
  res.send("This is useSignProcessor");
};
