import { NextFunction, Request, Response } from 'express';
import { db } from '../config/db';
import { User, UserUpdate } from '../types'
import { asyncHandler } from '../middleware/asyncHandler';

const listUsers = asyncHandler(async (_: Request, res: Response) => {
	let results = await db.selectFrom('users')
		.selectAll()
		.execute()

	res.json(results);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
	let id: number = parseInt(req.params.id)
	let results = await db.selectFrom('users')
		.where('id', '=', id)
		.selectAll()
		.executeTakeFirst()

	res.json(results);
});

const createUser = asyncHandler(async (req: Request, res: Response) => {
	let user: User = req.body
	let results = await db.insertInto('users')
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow()

	res.send(results);
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	let id: number = parseInt(req.params.id)

	let results = await db.deleteFrom('users')
		.where('id', '=', id)
		.returningAll()
		.executeTakeFirstOrThrow()

	console.log(results)
	res.send(results);
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {

	let id: number = parseInt(req.params.id)
	let userUpdate: UserUpdate = req.body

	let results = await db.updateTable('users')
		.set(userUpdate)
		.where('id', '=', id)
		.returningAll()
		.executeTakeFirstOrThrow()

	console.log(results)
	res.send(results);
});

export { listUsers, getUser, createUser, deleteUser, updateUser }
