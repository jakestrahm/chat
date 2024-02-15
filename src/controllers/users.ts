import { Request, Response } from 'express';
import { db } from '../config/db';
import { User, UserUpdate } from '../types'

const getUsers = async (_: Request, res: Response) => {
	let results = await db.selectFrom('users')
		.selectAll()
		.execute()

	res.json(results);
}

const getUser = async (req: Request, res: Response) => {
	let id: number = parseInt(req.params.id)

	let results = await db.selectFrom('users')
		.where('id', '=', id)
		.selectAll()
		.executeTakeFirst()

	res.json(results);
}

const createUser = async (req: Request, res: Response) => {
	let user: User = req.body
	console.log(user)

	let results = await db.insertInto('users')
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow()

	console.log(results)
	res.send(results);
}

const deleteUser = async (req: Request, res: Response) => {
	let id: number = parseInt(req.params.id)

	try {
		let results = await db.deleteFrom('users')
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow()

		console.log(results)
		res.send(results);
	} catch (err) {
		console.error({ err })
		res.status(500).json({ "error": err })
	}
}
const updateUser = async (req: Request, res: Response) => {
	let id: number = parseInt(req.params.id)
	let userUpdate: UserUpdate = req.body

	try {

		let results = await db.updateTable('users')
			.set(userUpdate)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow()

		console.log(results)
		res.send(results);
	} catch (err: DatabaseError) {
		console.error({ err })
		let errorMessage = err.message
		res.status(500).json({ "error": errorMmessage })
	}
}

export { getUsers, getUser, createUser, deleteUser, updateUser }
