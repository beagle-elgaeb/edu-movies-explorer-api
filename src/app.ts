import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cors from './middlewares/cors';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import rateLimiter from './middlewares/rate-limit';
import routes from './routes';

dotenv.config();

const { NODE_ENV, DATA_BASE, PORT = 3000 } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE! : 'mongodb://localhost:27017/moviesdb', {});

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(rateLimiter);
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App слушает порт ${PORT}`);
});
