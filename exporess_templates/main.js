const port = 3000,
  express = require("express"),
  app = express(),
  layout = require("express-ejs-layouts"),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController.js");

app.set("view engine", "ejs");

app.use(layout);
app.use(express.static("public"));

app.get("/name/:myName", homeController.respondWithName);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);
app.use(errorController.logErrors);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
