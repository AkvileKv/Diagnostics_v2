require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const {
  v4: uuidv4
} = require('uuid'); // uuid, To call: uuidv4();
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
//onst _ = require("lodash");
const Nepti = require('./models/nepti');
const User = require('./models/user');

const homeRouter = require('./controllers/home');
const citeRouter = require('./controllers/cite-us');
const searchRouter = require('./controllers/search');
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');
const notFund404Router = require('./controllers/404');
const notFund404_userRouter = require('./controllers/404-user');
const notFund404_adminRouter = require('./controllers/404-admin');
// const databaseRouter = require('./controllers/database');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.static("models"));
app.use(express.static("assets"));

app.use("/", homeRouter);
app.use("/cite-us", citeRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/404", notFund404Router);
app.use("/404-user", notFund404_userRouter);
app.use("/404-admin", notFund404_adminRouter);
app.use("/s-central-asia", searchRouter);
app.use("/s-central-america", searchRouter);
app.use("/s-continental-east-asia", searchRouter);
app.use("/s-south-america", searchRouter);
app.use("/s-the-himalaya", searchRouter);
// app.use("/database", databaseRouter);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  genid: function(req) {
    return uuidv4();
  },
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false
  } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/register", (req, res) => {

  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      console.log("User exists");
      res.redirect("/register");
    } else {
      User.register({
        username: req.body.username,
        role: "user"
      }, req.body.password, function(err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/all-records");
          });
        }
      });
    }
  });

});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

//-----------pagal URL / atvaizduoja search.ejs --------
app.get("/search-central-asia", (req, res) => {
  res.render("s-central-asia");
});
app.get("/search-central-america", (req, res) => {
  res.render("s-central-america");
});
app.get("/search-continental-east-asia", (req, res) => {
  res.render("s-continental-east-asia");
});
app.get("/search-south-america", (req, res) => {
  res.render("s-south-america");
});
app.get("/search-the-himalaya", (req, res) => {
  res.render("s-the-himalaya");
});

//------------Randu ir isvedu visus irasus esancius DB--------
app.get("/database", (req, res) => {

  if (req.isAuthenticated()) {
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          Nepti.find({}, function(err, neptis) {
            if (err) {
              console.log(err);
            } else {
              console.log("Turi isvesti rezultatus");
              res.render("database", {
                neptis: neptis
              });
            }
          });
        } else {
          console.log("User role unknown");
          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/all-records", (req, res) => {

  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "user") {
          Nepti.find({}, function(err, neptis) {
            if (err) {
              console.log(err);
            } else {
              console.log("Turi isvesti rezultatus");
              res.render("all-records", {
                neptis: neptis
              });
            }
          });
        } else {
          console.log("User role unknown");
          res.redirect("/404-admin");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/create", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          res.render("create");
        } else {
          console.log("User role unknown");
          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/edit", (req, res) => {

  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          Nepti.find({}, function(err, neptis) {
            if (err) {
              console.log(err);
            } else {
              res.render("edit", {
                neptis: neptis
              });
            }
          });
        } else {

          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/delete", function(req, res) {

  Nepti.deleteOne({
      _id: req.body.deleteById
    },
    function(err) {
      if (!err) {
        res.redirect("/database");
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/edit/:neptiId", (req, res) => {
  //console.log("neptiID");
  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          const requestedId = req.params.neptiId;
          if (requestedId.match(/^[0-9a-fA-F]{24}$/)) {
            // Yes, it's a valid ObjectId, proceed with `findById` call.

            Nepti.findById((requestedId), function(err, nepti) {
              if (err) {
                console.log("error");
                console.log(err);
                res.redirect("/404-admin");
              } else {
                res.render("edit-one", {
                  nepti: nepti
                });
              }
            });
          } else {
            res.redirect("/404-admin");
          }
        } else {
          console.log("User role unknown");
          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

//---------Log In-------
app.post("/login", (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  // to log in and authenticate it. login Method comes from passport
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", {
        failureRedirect: '/login'
      })(req, res, function() {

        User.findById(req.user.id, function(err, foundUser) {
          if (err) {
            console.log("Error...");
            console.log(err);
          } else {
            if (foundUser.role === "admin") {
              res.redirect("/database");
            } else if (foundUser.role === "user") {
              console.log("User role: user");
              res.redirect("/all-records");
            }
          }
        });
      });
    }
  });
});

//------------create.ejs formoj ivedu nauja irasa ir nukreipiu i /database--------
app.post("/create", (req, res) => {

  const nepti = new Nepti({
    region: req.body.region,
    species: req.body.species,
    hostplantfamily: req.body.hostplantfamily,
    forewing: req.body.forewing,
    tegumen: req.body.tegumen,
    uncus: req.body.uncus,
    gnathos: req.body.gnathos,
    valva: req.body.valva,
    juxta: req.body.juxta,
    transtilla: req.body.transtilla,
    vinculum: req.body.vinculum,
    phalluswithoutcarinae: req.body.phalluswithoutcarinae,
    phalluswithcarinae: req.body.phalluswithcarinae,
    filepath: req.body.filepath
  });

  nepti.save(function(err) {
    if (!err) {
      console.log("Succesfully created");
      res.redirect("/database");
    }
  });
});

app.post("/update", (req, res) => {

  Nepti.findById(req.body.id, function(err, foundNepti) {
    if (err) {
      console.log("Error...");
      console.log(err);
    } else {
      if (foundNepti) {
        foundNepti.species = req.body.species,
          foundNepti.region = req.body.region,
          foundNepti.filepath = req.body.filepath

        if (req.body.hostplantfamily != null) {
          foundNepti.hostplantfamily = req.body.hostplantfamily
        }
        if (req.body.forewing != null) {
          foundNepti.forewing = req.body.forewing
        }
        if (req.body.tegumen != null) {
          foundNepti.tegumen = req.body.tegumen
        }
        if (req.body.uncus != null) {
          foundNepti.uncus = req.body.uncus
        }
        if (req.body.gnathos != null) {
          foundNepti.gnathos = req.body.gnathos
        }
        if (req.body.valva != null) {
          foundNepti.valva = req.body.valva
        }
        if (req.body.juxta != null) {
          foundNepti.juxta = req.body.juxta
        }
        if (req.body.transtilla != null) {
          foundNepti.transtilla = req.body.transtilla
        }
        if (req.body.vinculum != null) {
          foundNepti.vinculum = req.body.vinculum
        }
        if (req.body.phalluswithoutcarinae != null) {
          foundNepti.phalluswithoutcarinae = req.body.phalluswithoutcarinae
        }
        if (req.body.phalluswithcarinae != null) {
          foundNepti.phalluswithcarinae = req.body.phalluswithcarinae
        }

        foundNepti.save(function(err) {
          if (!err) {
            console.log("Succesfully  updated");
            res.redirect("/database");
          }
        });
      } else {
        console.log("Nepti does'f found");
      }
    }
  });
});

app.use('/*/*', (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
        res.render("404-admin");
      } else if (foundUser.role === "user"){
          res.render("404-user");
        } else {
          console.log("User role unknown");
          res.redirect("/404");
        }
      }
    });
  } else {
    res.render("404");
  }
});

app.use('*', (req, res) => {
  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
        res.render("404-admin");
      } else if (foundUser.role === "user"){
          res.render("404-user");
        } else {
          console.log("User role unknown");
          res.redirect("/404");
        }
      }
    });
  } else {
    res.render("404");
  }
});

app.listen(3000, function() {
  console.log("Diagnostics App has started successfully");
});
