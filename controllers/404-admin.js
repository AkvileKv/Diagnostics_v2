const express = require("express");
const router = express.Router() //router function

router.get("/", (req, res) => {
  res.render("404-admin");
});

module.exports = router;
