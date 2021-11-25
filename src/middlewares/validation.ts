import { celebrate, CelebrateError, Joi } from 'celebrate';
import validator from 'validator';
import { incorrectUrl } from '../constants';

const validUrl = (link: string) => {
  if (
    !validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true })) {
    throw new CelebrateError(incorrectUrl);
  }

  return link;
};

export const validNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

export const validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const validUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

export const validMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validUrl),
    trailer: Joi.string().required().custom(validUrl),
    thumbnail: Joi.string().required().custom(validUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

export const validMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
});
