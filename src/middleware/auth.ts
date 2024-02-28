import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './asyncHandler';
import { sql } from '../db/db';
const protect = (asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
    const token = req.headers.authorization
    console.log(token)

    //will probably be sent implicitly
    const userId: number = parseInt(req.params.id);
    console.log({ userId })

    if (token) {
        const getSession = await sql`
            select id
            from sessions
            where user_id = ${userId}
            and token = ${token}
            and expires_at > ${new Date(new Date().getTime())}
            `
        if (getSession.length > 0) {
            console.log("getSession IS NOT EMPTY!")
            next()
        } else {
            throw Error('unauthorized')
        }
    } else {
        throw Error('unauthorized')
    }


}));

export { protect }
