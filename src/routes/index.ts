import rout from 'express';
import { notFound } from '../constants';
import { createUser, login, logout } from '../controllers/auth';
import NotFoundError from '../errors/not-found-err';
import auth from '../middlewares/auth';
import { validLogin, validNewUser } from '../middlewares/validation';
import moviesRouter from './movies';
import usersRouter from './users';

const routes = rout.Router();

routes.post('/signup', validNewUser, createUser);
routes.post('/signin', validLogin, login);
routes.get('/signout', logout);

routes.use('/users', auth, usersRouter);
routes.use('/movies', auth, moviesRouter);

routes.use('/*', auth, () => { throw new NotFoundError(notFound); });

export default routes;
