import rout from 'express';
import { deleteMovie, getMovies, postMovie } from '../controllers/movies';
import { validMovie, validMovieId } from '../middlewares/validation';

const router = rout.Router();

router.get('/', getMovies);
router.post('/', validMovie, postMovie);
router.delete('/:movieId', validMovieId, deleteMovie);

export default router;
