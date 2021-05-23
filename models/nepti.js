const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const neptiSchema = new Schema({
  region: String,
  species: String,
  hostplantfamily: [String],
  forewing: [String],
  tegumen: [String],
  uncus: [String],
  gnathos: [String],
  valva: [String],
  juxta: [String],
  transtilla: [String],
  vinculum: [String],
  phalluswithoutcarinae: [String],
  phalluswithcarinae: [String],
  filepath: String
});

const Nepti = new mongoose.model("Nepti", neptiSchema);

module.exports = Nepti;
