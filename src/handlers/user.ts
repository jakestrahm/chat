import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import validator from 'validator';
import dotenv from 'dotenv'
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { sql } from './../db/db'

dotenv.config();

const listUsers = asyncHandler(async (_: Request, res: Response) => {
    let listUsers = await sql`
		select
			id,
			username,
			email,
			created_at
		from users `

    console.log(listUsers);
    res.json(listUsers);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
    let getUser = await sql`
		select
			id,
			username,
			email,
			created_at
		from users
		where id = ${parseInt(req.params.id)} `

    console.log(getUser)
    res.json(getUser)
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    let deleteUser = await sql`
		delete from users
		where id = ${parseInt(req.params.id)}
		returning id, username, email, created_at `

    if (deleteUser.length == 0) {
        throw Error(`user with id ${req.params.id} not found`)
    }

    console.log(deleteUser)
    res.json(deleteUser)
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const validEmail = req.body?.email && validator.isEmail(req.body.email)
    const validUsername = req.body?.username && validator.isLength(req.body.username, { min: 3, max: 20 })
    const validId = await sql`select id from users where id = ${req.params.id}`

    if (!validEmail && !validUsername) {
        throw Error(`invalid ${validEmail == false ? `email` : `username`}`)
    }

    if (validId.length == 0) {
        throw Error(`user with id ${req.params.id} not found`)
    }


    const updateUser = await sql`
	 update users
	 set
	 ${validEmail ?
            sql` email = ${req.body.email} `
            : sql``
        }
	 ${validUsername ?
            sql` username = ${req.body.username} `
            : sql``
        }
	 where id = ${parseInt(req.params.id)}
	 returning *
	`
    console.log(updateUser)
    res.send({ updateUser });
});

const signUp = asyncHandler(async (req: Request, res: Response) => {
    const validEmail = req.body?.email && validator.isEmail(req.body.email)
    const validUsername = req.body?.username && validator.isLength(req.body.username, { min: 3, max: 20 })
    const validPassword = req.body?.password && validator.isStrongPassword(req.body.password)

    if (!validEmail) {
        throw Error(`invalid email`)
    } else if (!validUsername) {
        throw Error(`invalid username`)
    } else if (!validPassword) {
        throw Error(`invalid password`)
    }

    //transaction
    let createUser;
    await sql.begin(async sql => {

        const emailInUse = await sql`select id from users where email = ${req.body.email}`
        const usernameInUse = await sql`select id from users where username = ${req.body.username}`

        if (emailInUse.length > 0) {
            throw Error(`email in use`)
        } else if (usernameInUse.length > 0) {
            throw Error(`username in use`)
        }

        createUser = await sql`
		insert into users (username, email, password_hash)
		values (${req.body.username}, ${req.body.email}, ${await bcrypt.hash(req.body.password, 10)})
		returning username, email, created_at `

        return createUser;
    });

    console.log(createUser)
    res.send(createUser);
});

const signIn = asyncHandler(async (req: Request, res: Response) => {

    if (!req.body.email && !req.body.username) {
        throw Error('provide email or username.')
    }

    if (!req.body.password) {
        throw Error('provide password.')
    }

    const getUser = await sql`
		select
			password_hash,
			id
			${req.body.email ? sql`,email` : sql``}
			${req.body.username ? sql`,username` : sql``}
		from users
		${req.body.email ? sql`where email = ${req.body.email}` : sql``}
		${req.body.username ? sql`where username = ${req.body.username}` : sql``}
		`
    console.log({ getUser })

    if (//if password_hash of corresponding record doesn't match hashed sent password
        !(getUser[0]?.password_hash
            && await bcrypt.compare(req.body.password, getUser[0].password_hash))) {
        throw Error('wrong password')
    }

    let token = uuidv4()

    const createSession = await sql`
		insert into sessions (user_id, expires_at, token)
		values(
			${getUser[0].id},
			${new Date(new Date().getTime() + 60 * 60 * 1000)},
			${token})
		`

    console.log(createSession)
    res.json(token)

});

const signOut = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization


    if (!token) {
        throw Error('unauthorized')
    }
    const expireToken = await sql`
        update sessions
        set
            expires_at = ${new Date(new Date().getTime())}
        where token = ${token}
        returning * `

    console.log(expireToken)
    res.json(expireToken)
});

export { listUsers, getUser, deleteUser, updateUser, signUp, signIn, signOut }
