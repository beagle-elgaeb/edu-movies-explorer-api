const { celebrate, Joi, CelebrateError } = require("celebrate");
const validator = require("validator");

const validUrl = (link) => {
  if (
    !validator.isURL(link, { protocols: ["http", "https"], require_protocol: true })) {
    throw new CelebrateError("Некорректный URL");
  }

  return link;
};

module.exports.validNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validUrl),
    trailer: Joi.string().required().custom(validUrl),
    thumbnail: Joi.string().required().custom(validUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
});
