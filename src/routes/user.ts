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

const registerUserRoutes = (sql: Sql) => {
    const router = express.Router();

    router
        .route('/')
        .get(listUsers(sql));

    router
        .route('/signUp')
        .post(signUp(sql));

    router
        .route('/signIn')
        .post(signIn(sql));

    router
        .route('/signOut')
        .post(signOut(sql));

    router
        .route('/:id')
        .get(getUser(sql))
        .put(updateUser(sql))
        .delete(deleteUser(sql))

    return router;
}

export { registerUserRoutes };
