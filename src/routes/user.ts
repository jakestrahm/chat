import express from 'express';
import {
    signUp,
    signIn,
    signOut,
    deleteUser,
    updateUser,
    getUser,
    listUsers,
} from '../handlers/user';
import { protect } from '../middleware/auth';


const router = express.Router();

router
    .route('/')
    .get(listUsers)
    .post(signUp)

router
    .route('/signIn')
    .post(signIn)

router
    .route('/signOut')
    .post(signOut)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)
// .put(protect, updateUser)
// .delete(protect, deleteUser)

export { router }
