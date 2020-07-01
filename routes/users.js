//Require modules
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const express = require("express");
const router = express.Router();

// POST User route
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if this email is already exist
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already in use");

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));

  //Hash and Salt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  //Generate JSON web token
  const token = user.generateAuthToken();

  res.header("x-auth-token", token);

  //Use loadash to pick what data to send back
  res.send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//Export Router
module.exports = router;
