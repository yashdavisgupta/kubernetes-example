const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    payload: {
      user: req.user,
      message: "This user exists and is logged in"
    },
    error: null,
  });
});

module.exports = router;
