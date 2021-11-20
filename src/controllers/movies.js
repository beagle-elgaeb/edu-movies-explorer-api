const Movie = require("../models/movie");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).sort({ createdAt: "desc" });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.postMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      nameRU,
      nameEN,
      owner: req.user._id,
    });

    if (!movie) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    res.send(movie);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Переданы некорректные данные"));
      return;
    }

    next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      throw new NotFoundError("Карточка не найдена");
    }

    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError("Для этого действия недостаточно прав");
    }

    await Movie.findByIdAndRemove(movieId);

    res.send(movie);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Невалидный id"));
      return;
    }

    next(err);
  }
};
