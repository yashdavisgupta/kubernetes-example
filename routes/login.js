const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../schemas/user");

const { body, validationResult } = require('express-validator');

router.post("/login", [
                        body('email').isEmail().isLength({min: 6, max: 255}).exists(),
                        body('password').isString().isAlphanumeric().isLength({min: 10, max: 1023}).exists(),
                      ],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ error: "That email isn't connected to a user" });

  const password = await bcrypt.compare(req.body.password, user.password);
  if (!password)
    return res.status(400).json({ error: "Incorrect password" });

  const secret = process.env.SECRET || 'Please Set The Secret'
  const token = jwt.sign({name: user.name, id: user._id,}, secret, {expiresIn: '1h'});
  res.header("token", token).json({error: null, data: {token}})
});

module.exports = router;
