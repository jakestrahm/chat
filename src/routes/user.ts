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

export { router }
