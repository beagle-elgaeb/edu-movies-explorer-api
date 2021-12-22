import { NextFunction, Request, Response } from 'express';
import {
  filmNotFound, incorrectData, invalidId,
} from '../constants';
import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import Movie from '../models/movie';

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user._id;

  try {
    const movies = await Movie.find({ owner: userId }).sort({
      createdAt: 'desc',
    });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

export const postMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
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
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    });

    if (!movie) {
      throw new BadRequestError(incorrectData);
    }

    res.send(movie);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(incorrectData));
      return;
    }

    next(err);
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findOne({ movieId, owner: req.user._id });

    if (!movie) {
      throw new NotFoundError(filmNotFound);
    }

    await Movie.findByIdAndRemove(movie._id);

    res.send(movie);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError(invalidId));
      return;
    }

    next(err);
  }
};
