import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../utilities/ResponseError';

const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {

    if (err instanceof ResponseError) {
        res.status(err.statusCode).json({ error: err.message })
    } else {
        console.error(err.message)

    }
}

export { errorHandler }
