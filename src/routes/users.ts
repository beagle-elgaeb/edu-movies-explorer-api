import rout from 'express';
import { getUser, updateUser } from '../controllers/users';
import { validUser } from '../middlewares/validation';

const router = rout.Router();

router.get('/me', getUser);
router.patch('/me', validUser, updateUser);

export default router;
