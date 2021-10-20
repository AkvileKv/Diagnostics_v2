require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const _ = require("lodash");
const Nepti = require('./models/nepti');
const User = require('./models/user');

const homeRouter = require('./controllers/home');
const citeRouter = require('./controllers/cite-us');
const searchRouter = require('./controllers/search');
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');
const notFund404Router = require('./controllers/404');
const notFund404_userRouter = require('./controllers/404-user');
// const searchCentraAmericaRouter = require('./controllers/search-central-america');
// const searchContinentalEAsiaRouter = require('./controllers/search-continental-east-asia');
// const searchSouthAmericaRouter = require('./controllers/search-south-america');
// const searchTheHimalayaRouter = require('./controllers/search-the-himalaya');

// const databaseRouter = require('./controllers/database');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.static("models"));
app.use(express.static("assets"));

app.use("/", homeRouter);
app.use("/cite-us", citeRouter);
app.use("/search", searchRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/404", notFund404Router);
app.use("/404-user", notFund404_userRouter);
app.use("/search-central-america", searchRouter);
// app.use("/search-continental-east-asia", searchContinentalEAsiaRouter);
// app.use("/search-south-america", searchSouthAmericaRouter);
// app.use("/search-the-himalaya", searchTheHimalayaRouter);
// app.use("/database", databaseRouter);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
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
    var message;
    if (user) {
      console.log(user);
      message = "User exists";
      console.log(message);
      res.redirect("/register");
    } else {
      // console.log(user);
      //   message= "user doesn't exist";
      //   console.log(message);
      User.register({
        username: req.body.username
      }, req.body.password, function(err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/database");
          }, );
        }
      });
    }
    // res.json({message: message});
  });

});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

//-----------pagal URL / atvaizduoja search.ejs --------
app.get("/search-page", (req, res) => {
  res.render("search");
});
app.get("/search-central-america-p", (req, res) => {
  res.render("search-central-america");
});
// app.get("/search-continental-east-asia", (req, res) => {
//   res.render("search");
// });
// app.get("/search-south-america", (req, res) => {
//   res.render("search");
// });
// app.get("/search-the-himalaya", (req, res) => {
//   res.render("search");
// });

//------------Randu ir isvedu visus irasus esancius DB--------
app.get("/database", (req, res) => {

  if (req.isAuthenticated()) {
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
    res.redirect("/login");
  }
});

app.get("/create", (req, res) => {

  if (req.isAuthenticated()) {
    res.render("create");
  } else {
    res.redirect("/login");
  }
});

app.get("/edit", (req, res) => {

  if (req.isAuthenticated()) {
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
    const requestedId = req.params.neptiId;
    if (requestedId.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `findById` call.

      Nepti.findById((requestedId), function(err, nepti) {
        if (err) {
          console.log("error");
          console.log(err);
          res.redirect("/404-user");
        } else {
          res.render("edit-one", {
            nepti: nepti
          });
        }
      });
    } else {
      res.redirect("/404");
    }
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
    //console.log(user);
    if (err) {
      console.log(err);
    } else {
      //console.log("else viduje");
      //toliau nepraeina, jei nera anksciau DB sukurtas
      passport.authenticate("local")(req, res, function() {
        //console.log("authenticate viduje");
        res.redirect("/database");
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
  // issaugau nauja irasa kolekcijoje
  nepti.save(function(err) {
    if (!err) {
      console.log("Succesfully created");
      res.redirect("/database");
    }
  });
});

app.post("/update", (req, res) => {

  Nepti.findOneAndUpdate({
      _id: req.body.id
    }, {
      $set: {
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
      }
    },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully updated item");
        console.log(req.body.region);
        res.redirect("/database");
      }
    }
  );
});

app.use('/*/*', (req, res) => {
  if (req.isAuthenticated()) {
    //console.log("paciam gale isoka i **");
    res.render("404-user");
  } else {
    res.render("404");
  }
});

app.use('*', (req, res) => {
  if (req.isAuthenticated()) {
    //console.log("paciam gale isoka i *");
    res.render("404-user");
  } else {
    res.render("404");
  }
});


app.listen(3000, function() {
  console.log("Diagnostics App has started successfully");
});
