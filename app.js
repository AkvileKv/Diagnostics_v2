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
// const editOneRouter = require('./controllers/edit-one');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.static("models"));
app.use(express.static("assets"));
// app.use(express.static("controllers"));

app.use("/", homeRouter);
app.use("/cite-us", citeRouter);
app.use("/search", searchRouter);
// app.use("/edit-one", searchRouter);

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
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});


app.post("/register", (req, res) => {

  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/database");
      });
    }
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

//------------Randu ir isvedu visus irasus esancius DB--------
app.get("/database", (req, res) => {

  if (req.isAuthenticated()) {

    Nepti.find({}, function(err, neptis) {
      if (err) {
        console.log(err);
      } else {
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

app.get("/:neptiId", (req, res) => {

  if (req.isAuthenticated()) {

      const requestedId = req.params.neptiId;

    Nepti.findById((requestedId
    ), function(err, nepti) {

      if (err) {
         console.log(err);
      } else {
      res.render("edit-one", {
        nepti: nepti
      });
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

  // to log in and authenticate it. Method comes from passport
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
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

//const selectedSpecies = req.query.dspecies;

    Nepti.findOneAndUpdate({
      _id : req.body.id},
       { $set: {
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

//   const nepti = new Nepti({
//     region: req.body.region,
//     species: req.body.species,
//     hostplantfamily: req.body.hostplantfamily,
//     forewing: req.body.forewing,
//     tegumen: req.body.tegumen,
//     uncus: req.body.uncus,
//     gnathos: req.body.gnathos,
//     valva: req.body.valva,
//     juxta: req.body.juxta,
//     transtilla: req.body.transtilla,
//     vinculum: req.body.vinculum,
//     phalluswithoutcarinae: req.body.phalluswithoutcarinae,
//     phalluswithcarinae: req.body.phalluswithcarinae,
//     filepath: req.body.filepath
//   });
//   // issaugau nauja irasa kolekcijoje
//   nepti.save(function(err) {
//     if (!err) {
//       console.log("Succesfully created item");
//       res.redirect("/database");
//     }
//   });
// });





app.use('*', (req, res) => {
  res.render("404");
});

app.listen(3000, function() {
  console.log("app has started successfully");
});
