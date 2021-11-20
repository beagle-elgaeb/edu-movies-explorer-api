const router = require("express").Router();
const valid = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const { getMovies, postMovie, deleteMovie } = require("../controllers/movies");

router.use(auth);

router.get("/", getMovies);
router.post("/", valid.validMovie, postMovie);
router.delete("/:movieId", valid.validMovieId, deleteMovie);

module.exports = router;
