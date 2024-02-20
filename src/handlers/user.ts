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

const createUser = asyncHandler(async (req: Request, res: Response) => {
	let user: NewUser = req.body
	let results = await db.insertInto('user')
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow()

	res.send(results);
});

export { listUsers, getUser, createUser, deleteUser, updateUser }
