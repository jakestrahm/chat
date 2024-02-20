import express from 'express';
import { createUser, deleteUser, updateUser, getUser, listUsers } from '../handlers/user';


const router = express.Router();

router
	.route('/')
	.get(listUsers)
	.post(createUser)

router
	.route('/:id')
	.get(getUser)
	.put(updateUser)
	.delete(deleteUser)

export { router }
