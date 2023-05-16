const httpStatus = require("http-status-codes");

// ステータスコード 404でレスポンス
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  // 404.htmlの内容を送信
  res.sendFile(`./public/${errorCode}.html`, { root: "./" });
};
// すべてのエラーをキャッチし、ステータスコード500でレスポンス
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occured: ${error.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our applocation is experiencing a problem!`);
};

// エラー処理用のミドルウェアを追加
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack);
  next(error);
};
