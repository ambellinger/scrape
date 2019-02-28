var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("./models");
var PORT = 3000;


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

//require("./controllers/routes")(app);

var routes = require("./controllers/routes");
  app.use(routes);

 //var routes = express.Router();

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoheadlinenews", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
