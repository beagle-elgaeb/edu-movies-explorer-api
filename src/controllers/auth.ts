import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { devSecret } from '../config';
import {
  authorizationCompleted, authorizationError, incorrectData, userFound,
} from '../constants';
import BadRequestError from '../errors/bad-request-err';
import ConflictError from '../errors/conflict-err';
import Unauthorized from '../errors/unauthorized-err';
import User from '../models/user';

const { NODE_ENV, JWT_SECRET } = process.env;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestError(incorrectData);
    }

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err: any) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError(userFound));
      return;
    }

    if (err.name === 'ValidationError') {
      next(new BadRequestError(incorrectData));
      return;
    }

    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user) {
      throw new Unauthorized(authorizationError);
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET! : devSecret,
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, NODE_ENV === 'production' ? {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 7 * 24 * 3600 * 1000,
      } : {})
      .send({ message: authorizationCompleted });
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('jwt').send({ success: true });
};
