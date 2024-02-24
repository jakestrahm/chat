import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './asyncHandler';
const protect = (asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization

	//will probably be sent implicitly
	const userId: number = parseInt(req.params.id) as any;

	console.log({ userId })

	if (token) {
		const getSession = true/*  = await db.selectFrom('session')
			.selectAll()
			.where('user_id', '=', userId)
			// .where('expires_at', '>', new Date())
			// .where('token', '=', token)
			.executeTakeFirst(); */
		console.log("session:", getSession)

		if (getSession) {
			next()
		} else {
			throw Error('user is not authorized to access this resource.')
		}
	}
}));

export { protect }
