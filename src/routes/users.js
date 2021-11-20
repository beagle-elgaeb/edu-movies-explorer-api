const router = require("express").Router();
const valid = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  getUser,
  updateUser,
} = require("../controllers/users");

router.use(auth);

router.get("/me", getUser);
router.patch("/me", valid.validUser, updateUser);

module.exports = router;
