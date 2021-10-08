const express = require("express");
const router = express.Router() //router function

router.get("/", (req, res) => {
  res.render("cite-us");
});

module.exports = router;
