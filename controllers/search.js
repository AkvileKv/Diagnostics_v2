const express = require("express");
const router = express.Router() //router function
const _ = require("lodash");
const Nepti = require('../models/nepti');

//-----------PAIESKA---------
router.get("/", function(req, res) {

  let linkRegion;
  let typedSpecies = _.toLower(req.query.dspecies);
  let defaultRegion = req.query.dregion;
  let selectedHostPlantFamily = req.query.dhostplantfamily;
  let selectedForewing = req.query.dforewing;
  let selectedTegumen = req.query.dtegumen;
  let selectedUncus = req.query.duncus;
  let selectedGnathos = req.query.dgnathos;
  let selectedValva = req.query.dvalva;
  let selectedJuxta = req.query.djuxta;
  let selectedTranstilla = req.query.dtranstilla;
  let selectedVinculum = req.query.dvinculum;
  let selectedPhallusWithoutCarinae = req.query.dphalluswithoutcarinae;
  let selectedPhallusWithCarinae = req.query.dphalluswithcarinae;

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
  if (req.query.dhostplantfamily == "null") {
    selectedHostPlantFamily = {
      $ne: null
    };
  }
  if (req.query.dforewing == "null") {
    selectedForewing = {
      $ne: null
    };
  }
  if (req.query.dtegumen == "null") {
    selectedTegumen = {
      $ne: null
    };
  }
  if (req.query.duncus == "null") {
    selectedUncus = {
      $ne: null
    };
  }
  if (req.query.dgnathos == "null") {
    selectedGnathos = {
      $ne: null
    };
  }
  if (req.query.dvalva == "null") {
    selectedValva = {
      $ne: null
    };
  }
  if (req.query.djuxta == "null") {
    selectedJuxta = {
      $ne: null
    };
  }
  if (req.query.dtranstilla == "null") {
    selectedTranstilla = {
      $ne: null
    };
  }
  if (req.query.dvinculum == "null") {
    selectedVinculum = {
      $ne: null
    };
  }
  if (req.query.dphalluswithoutcarinae == "null") {
    selectedPhallusWithoutCarinae = {
      $ne: null
    };
  }
  if (req.query.dphalluswithcarinae == "null") {
    selectedPhallusWithCarinae = {
      $ne: null
    };
  }

  Nepti.find({
    region: defaultRegion,
    species: typedSpecies,
    hostplantfamily: selectedHostPlantFamily,
    forewing: selectedForewing,
    tegumen: selectedTegumen,
    uncus: selectedUncus,
    gnathos: selectedGnathos,
    valva: selectedValva,
    juxta: selectedJuxta,
    transtilla: selectedTranstilla,
    vinculum: selectedVinculum,
    phalluswithoutcarinae: selectedPhallusWithoutCarinae,
    phalluswithcarinae: selectedPhallusWithCarinae
  },
  function(err, neptis) {
    if (err) {
      console.log(err);
    } else {
      // console.log("Paieskos parametrai - " + " typedSpecies: " + typedSpecies + " defaultRegion: " + defaultRegion +
      //   " and selectedHostPlantFamily: " + selectedHostPlantFamily + " and selectedForewing: " +
      //   selectedForewing + " and selectedTegumen: " + selectedTegumen + " and selectedUncus: " +
      //   selectedUncus + " and selectedGnathos: " + selectedGnathos + " and selectedValva: " +
      //   selectedValva + " and selectedJuxta: " + selectedJuxta + " and selectedTranstilla: " +
      //   selectedTranstilla + " and selectedVinculum: " + selectedVinculum +
      //   " and selectedPhallusWithoutCarinae: " + selectedPhallusWithoutCarinae +
      //   " and selectedPhallusWithCarinae: " + selectedPhallusWithCarinae);
      res.render("results", {
        neptis: neptis,
        region: _.toUpper(defaultRegion),
        regionLink: linkRegion
      });
    }
  });

});

module.exports = router;
