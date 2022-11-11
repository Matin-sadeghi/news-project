const express = require("express");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const methodOverride = require("method-override");
const fileupload = require("express-fileupload");
const path = require("path");

const { formatDate } = require("./utils/moment");
const connectdb = require("./config/db");

const app = express();

dotenv.config({
  path: "./config/config.env",
});

connectdb();

//static files
app.use(express.static(path.join(__dirname, "public")));

//passport
require("./config/passport");

//bodyParser
app.use(express.urlencoded({ extended: false }));

//methodOverride
app.use(methodOverride("_method"));

//session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(fileupload());

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals = {
    auth: {
      user: req.user,
      check: req.isAuthenticated(),
    },
    req,
    domain: process.env.DOMAIN,
    formatDate,
  };
  next();
});



//falsh
app.use(flash());

//view engine
app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "./layouts/mainLayout.ejs");

app.use("/", require("./routes/home"));
app.use("/users", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`find server on PORT : ${PORT} `);
});

