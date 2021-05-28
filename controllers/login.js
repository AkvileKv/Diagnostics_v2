const express = require("express");
const router = express.Router()
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');

//
// const User = require('../models/user');
// router.use(passport.initialize());
// router.use(passport.session());
//
// passport.use(User.createStrategy());
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//
//
//
router.get("/", (req, res) => {
  res.render("login");
});

// router.post("/", (req, res) => {
//   const user = new User({
//     username: req.query.username,
//     password: req.query.password
//   });
//
//   // to log in and authenticate it. Method comes from passport
//   req.login(user, function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, function() {
//         res.redirect("/database");
//       });
//     }
//   });
// });
//
module.exports = router;
