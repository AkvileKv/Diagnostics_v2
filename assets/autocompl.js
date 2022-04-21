const express = require("express");
const Nepti = require('../models/nepti');


let defaultRegion = "Central Asia";

Nepti.find({
  region: defaultRegion
},
function(err, neptis) {
  if (err) {
    console.log(err);
  } else {
    var allSpecies=[];
    for(i=0; i<neptis.length; i++)
    {
    allSpecies.push(neptis[i].species);
    console.log(allSpecies[i]);
    }
      var aaa = JSON.stringify(allSpecies)
  }
});

module.exports = aaa;
