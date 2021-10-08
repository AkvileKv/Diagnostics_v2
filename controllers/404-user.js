const express = require("express");
const router = express.Router() //router function

router.get("/", (req, res) => {
  res.render("404-user");
});

module.exports = router;
