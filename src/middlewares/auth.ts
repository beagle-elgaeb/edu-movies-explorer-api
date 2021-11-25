import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { devSecret } from '../config';
import { needToLogin } from '../constants';
import Unauthorized from '../errors/unauthorized-err';
import { UserData } from '../models/user';

const { NODE_ENV, JWT_SECRET } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const biscuit = req.cookies.jwt;

  if (!biscuit) {
    throw new Unauthorized(needToLogin);
  }

  let payload;

  try {
    payload = jwt.verify(
      biscuit,
      NODE_ENV === 'production' ? JWT_SECRET! : devSecret,
    );
  } catch (err) {
    throw new Unauthorized(needToLogin);
  }

  req.user = payload as UserData;

  next();
};

declare global {
  namespace Express {
    export interface Request {
      user: UserData;
    }
  }
}
