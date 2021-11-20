const { celebrate, Joi, CelebrateError } = require("celebrate");
const validator = require("validator");

const validUrl = (link) => {
  if (
    !validator.isURL(link, {
      protocols: ["http", "https"],
      require_protocol: true,
    })
  ) {
    throw new CelebrateError("Некорректный URL");
  }

  return link;
};

module.exports.validMovie = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validUrl),
  }),
});

module.exports.validMovieId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.validUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
