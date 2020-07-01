// Required modules
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find email in users collection and return
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  // Check the password against the returned user using bcrypt
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // Generate JSON Web Token
  const token = user.generateAuthToken();
  res.send(token);
});

// Joi validation
function validateAuth(auth) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(auth);
}

// Export Router
module.exports = router;
