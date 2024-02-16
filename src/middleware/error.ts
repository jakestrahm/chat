import { NextFunction, Request, Response } from 'express';

//TODO for controller file: do i need to pass in better errors to this? kylsely seems to give pretty fine messages

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(err)
	const error = err as Error;
	let errorMessage = error.message
	res.status(500).json({ "error": errorMessage })
}

export { errorHandler }
