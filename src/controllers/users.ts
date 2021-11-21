import { NextFunction, Request, Response } from 'express';
import {
  incorrectData, invalidId, userNotFound,
} from '../constants';
import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import User from '../models/user';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(userNotFound);
    }

    res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError(invalidId));
      return;
    }

    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { name } = req.body;

  try {
    if (!name) {
      throw new BadRequestError(incorrectData);
    }

    const userProfile = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true },
    );

    res.send(userProfile);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(incorrectData));
      return;
    }

    if (err.name === 'CastError') {
      next(new BadRequestError(invalidId));
      return;
    }

    next(err);
  }
};
