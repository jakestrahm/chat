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
import { Sql } from 'postgres';

const router = express.Router();

router
    .route('/')
    .get(listUsers);

router
    .route('/signUp')
    .post(signUp);

router
    .route('/signIn')
    .post(signIn);

router
    .route('/signOut')
    .post(signOut);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export { router };
