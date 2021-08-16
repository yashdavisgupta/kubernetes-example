const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../schemas/user");

const { body, validationResult } = require('express-validator');

router.post("/register", [
                          body('name').isString().isAlphanumeric().isLength({min: 6, max: 255}).exists(),
                          body('email').isEmail().isLength({min: 6, max: 255}).exists(),
                          body('password').isString().isAlphanumeric().isLength({min: 10, max: 1023}).exists(),
                         ],
  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const registered = await User.findOne({ email: req.body.email });
  if (registered)
    return res.status(400).json({ error: "That email is already registered" });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
