const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const config = require("./config/database");
const passport = require("passport");

mongoose.connect(config.database);
let db = mongoose.connection;

//check for db errors
db.on("error", err => {
  console.log(err);
});

//check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//init App
const app = express();

//Load view Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Ubacivanje MODELA za bazu
var Proizvod = require("./models/proizvod");
var Korpa = require("./models/korpa");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public folder as static for css and ...
app.use(express.static(path.join(__dirname, "public")));

//Express Session Midleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Express messages middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express validator middleware
app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Bring in the Passport config
require("./config/passport")(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Enable global user variable
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  if (!req.isAuthenticated()) {
    Korpa.remove({}, function(err, result) {
      if (err) {
        console.log(err);
      }
    });
  }
  next();
});

//RUTE
//RUTEE
//Home route
app.get("/", (req, res) => {
  let result = [];

  let cursor = db.collection("proizvodi").find();
  cursor.forEach(
    (doc, err) => {
      result.push(doc);
    },
    () => {
      Korpa.find({}, (err, items) => {
        res.render("index", {
          korpa: items,
          proizvodi: result
        });
      });
    }
  );
});

// Route Files za rute iz /proizvodi i /korpa, svakako imas module export router tamo, prihvacas ruter!
let proizvodi = require("./routes/proizvodi");
app.use("/proizvodi", proizvodi);
let korpa = require("./routes/korpa");
app.use("/korpa", korpa);
let users = require("./routes/users");
app.use("/users", users);

//Start server
app.listen(3000, () => {
  console.log("Server started on port 3000!");
});
