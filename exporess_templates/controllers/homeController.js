exports.respondWithName = (req, res) => {
  // リクエストのパラメータをローカル変数に代入
  let paramsName = req.params.myName;
  // ローカル変数を、レンダリングしたビューに渡す
  res.render("index", { name: paramsName });
};
