import { NextFunction, Request, Response } from 'express';
import { db } from '../config/db';
import { User, UserUpdate } from '../types'

const getUsers = async (_: Request, res: Response, next: NextFunction) => {
	try {
		let results = await db.selectFrom('users')
		.selectAll()
		.execute()

		res.json(results);
	} catch (err) {
		next(err)
	}
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let id: number = parseInt(req.params.id)
		let results = await db.selectFrom('users')
		.where('id', '=', id)
		.selectAll()
		.executeTakeFirst()

		res.json(results);
	} catch (err) {
		next(err)
	}
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user: User = req.body
		let results = await db.insertInto('users')
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow()

		res.send(results);
	} catch (err) {
		next(err)
	}
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let id: number = parseInt(req.params.id)
		let results = await db.deleteFrom('users')
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow()

		console.log(results)
		res.send(results);
	} catch (err) {
		next(err)
	}
}
const updateUser = async (req: Request, res: Response, next: NextFunction) => {

	try {
		let id: number = parseInt(req.params.id)
		let userUpdate: UserUpdate = req.body

		let results = await db.updateTable('users')
			.set(userUpdate)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow()

		console.log(results)
		res.send(results);
	} catch (err) {
		next(err);
	}
}

export { getUsers, getUser, createUser, deleteUser, updateUser }
