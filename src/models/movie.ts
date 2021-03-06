import mongoose from 'mongoose';
import validator from 'validator';
import { incorrectUrl } from '../constants';

const movieSchema = new mongoose.Schema({
  country: { type: String, required: true },
  director: { type: String, required: true },
  duration: { type: Number, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link: string) {
        return validator.isURL(link);
      },
      message: incorrectUrl,
      require_protocol: true,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(link: string) {
        return validator.isURL(link);
      },
      message: incorrectUrl,
      require_protocol: true,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link: string) {
        return validator.isURL(link);
      },
      message: incorrectUrl,
      require_protocol: true,
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  movieId: { type: Number, required: true },
  nameRU: { type: String, required: true },
  nameEN: { type: String, required: true },
});

export default mongoose.model('movie', movieSchema);
