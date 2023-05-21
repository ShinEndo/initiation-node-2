const httpsStatus = require("http-status-codes");

exports.pageNotFoundError = (req, res) => {
  let errorCode = httpsStatus.NOT_FOUND;
  res.status(errorCode);
  res.render("error");
};
exports.internalServerError = (error, req, res, next) => {
  let errorCode = httpStatus.internal_Server_Error;
  console.log(`ERROR occurred: ${error.stack}`);
  res.send(`${errorCode} | Sorry, our application is taking  nap!`);
};
