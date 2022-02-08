const express = require("express");
const router = express.Router() //router function
const _ = require("lodash");
const Nepti = require('../models/nepti');

router.get("/", function(req, res) {

  let linkRegion;
  let typedSpecies = _.toLower(req.query.dspecies);

  if (defaultRegion === "Central America") {
    linkRegion = "central-america"
  } else if (defaultRegion === "Central Asia") {
    linkRegion = "central-asia"
  } else if (defaultRegion === "South America") {
    linkRegion = "south-america"
  } else if (defaultRegion === "Continental East Asia") {
    linkRegion = "continental-east-asia"
  } else if (defaultRegion === "The Himalaya") {
    linkRegion = "the-himalaya"
  } else {
    console.log("nerasta");
  }

  if (req.query.dspecies == "") {
    typedSpecies = {
      $ne: null
    };
  }

  Nepti.find({
    species: typedSpecies,
  },
  function(err, neptis) {
    if (err) {
      console.log(err);
    } else {
//
      var data=[]; // save all species for region
      for(i=0; i<neptis.length; i++)
      {
      data.push(neptis[i].species);
      console.log(data[i]);
      }
//
      res.render("results", {
        neptis: neptis,
        region: _.toUpper(defaultRegion),
        regionLink: linkRegion
      });
    }
  });
  
});

module.exports = router;
