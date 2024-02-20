import { Request, Response, NextFunction } from 'express';

//TODO for controller file: do i need to pass in better errors to this? kylsely seems to give pretty fine messages
const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
	const error = err as Error;
	let errorMessage = error.message
	console.log(errorMessage)
	res.status(500).json({ "error": errorMessage })
}

export { errorHandler }
