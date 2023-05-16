const port = 3000,
  express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController");
layout = require("express-ejs-layouts");

app.set("view engine", "ejs");

app.use(layout);

app.get("/name/:myName", homeController.respondWithName);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
