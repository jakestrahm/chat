import bcrypt from 'bcrypt';
import validator from 'validator';
import { Request, Response } from 'express';
import { db } from '../db/db';
import { UserUpdate, NewUser, UserId } from '../models/public/User';
import { asyncHandler } from '../middleware/asyncHandler';

const listUsers = asyncHandler(async (_: Request, res: Response) => {
	let results = await db.selectFrom('user')
		.selectAll()
		.execute()

	res.json(results);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
	const userId: UserId = parseInt(req.params.id) as any;

	let results = await db.selectFrom('user')
		.where('id', '=', userId)
		.selectAll()
		.executeTakeFirst()

	res.json(results);
});


const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const userId: UserId = parseInt(req.params.id) as any;

	let results = await db.deleteFrom('user')
		.where('id', '=', userId)
		.returningAll()
		.executeTakeFirstOrThrow()

	console.log(results)
	res.send(results);
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const userId: UserId = parseInt(req.params.id) as any;
	let userUpdate: UserUpdate = req.body

	let results = await db.updateTable('user')
		.set(userUpdate)
		.where('id', '=', userId)
		.returningAll()
		.executeTakeFirstOrThrow()

	console.log(results)
	res.send(results);
});

const signUp = asyncHandler(async (req: Request, res: Response) => {
	if (!validator.isEmail(req.body.email)) {
		throw Error(`${req.body.email} is not a valid email.`)
	}

	const emailInUse = await db.selectFrom('user')
		.select('email')
		.where('email', '=', req.body.email)
		.executeTakeFirst();

	if (emailInUse) {
		throw Error(`${req.body.email} is already in use.`)
	}

	const usernameInUse = await db.selectFrom('user')
		.select('username')
		.where('username', '=', req.body.username)
		.executeTakeFirst();

	if (usernameInUse) {
		throw Error(`${req.body.username} is already in use.`)
	}

	let user: NewUser = {
		username: req.body.username,
		email: req.body.email,
		password_hash: await bcrypt.hash(req.body.password, 10)
	}

	let results = await db.insertInto('user')
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow()

	res.send(results);
});

const signIn = asyncHandler(async (req: Request, res: Response) => {
});

const signOut = asyncHandler(async (req: Request, res: Response) => {
});

export { listUsers, getUser, signUp, deleteUser, updateUser }
