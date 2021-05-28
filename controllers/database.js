// const express = require("express");
// const session = require('express-session');
// const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');
// const router = express.Router() //router function
// const Nepti = require('../models/nepti');
// 
// router.get("/", (req, res) => {
//
//   //if (req.isAuthenticated()) {
//
//     Nepti.find({}, function(err, neptis) {
//       if (err) {
//       console.log(err);
//       } else {
//         console.log("Turi isvesti rezultatus");
//         res.render("database", {
//           neptis: neptis
//         });
//       }
//     });
//
// //  } else {
//   //  res.redirect("/login");
// //  }
//
// });
//
// module.exports = router;
