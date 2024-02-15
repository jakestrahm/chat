import express from 'express';
import { createUser, deleteUser, updateUser, getUser, getUsers } from '../controllers/users';
import exp from 'constants';


const router = express.Router();

router
	.route('/')
	.get(getUsers)
	.post(createUser)

router
	.route('/:id')
	.get(getUser)
	.put(updateUser)
	.delete(deleteUser)

export { router }
