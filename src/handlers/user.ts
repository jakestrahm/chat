import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import validator from 'validator';
import dotenv from 'dotenv'
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ResponseError } from '../utilities/ResponseError';
import {
    selectUserById,
    selectUsers,
    deleteUserById,
    insertUser,
    InsertUser
} from '../models/users';
import { Sql } from 'postgres';

dotenv.config();

const listUsers = (sql: Sql) => asyncHandler(async (_: Request, res: Response) => {
    let users = await selectUsers(sql)
    console.log({ users });
    res.json(users);
});

const getUser = (sql: Sql) => asyncHandler(async (req: Request, res: Response) => {
    let user = await selectUserById(sql, parseInt(req.params.id))

    if (user.length == 0) {
        throw new ResponseError('no user with id ${userId} found', 404)
    }
    console.log(getUser)
    res.json(getUser)
});

const user = (sql: Sql) => asyncHandler(async (req: Request, res: Response) => {
    let id: number = parseInt(req.params.id)

    if (!id) {
        throw new ResponseError(`missing user id`, 400)
    }

    let deleteUser = await deleteUserById(sql, id)

    if (deleteUser.length == 0) {
        throw new ResponseError('no user with id ${userId} found', 404)
    }

    console.log(deleteUser)
    res.json(deleteUser)
});

const updateUser = (sql: Sql) => asyncHandler(async (req: Request, res: Response) => {
    const validEmail = req.body?.email && validator.isEmail(req.body.email)
    const validUsername = req.body?.username && validator.isLength(req.body.username, { min: 3, max: 20 })
    const validId = await sql`select id from users where id = ${req.params.id}`

    if (!validEmail && !validUsername) {
        throw new ResponseError(`invalid ${validEmail == false ? `email` : `username`}`, 400)
    }

    if (validId.length == 0) {
        throw new ResponseError(`user with id ${req.params.id} not found`, 404)
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
        returning id, username, email, created_at `

    console.log(updateUser)
    res.send({ updateUser });
});

const signUp = (sql: Sql) => asyncHandler(async (req: Request, res: Response) => {
    const validEmail = req.body?.email && validator.isEmail(req.body.email)
    const validUsername = req.body?.username && validator.isLength(req.body.username, { min: 3, max: 20 })
    const validPassword = req.body?.password && validator.isStrongPassword(req.body.password)

    if (!validEmail) {
        throw new ResponseError(`invalid email`, 400)
    } else if (!validUsername) {
        throw new ResponseError(`invalid username`, 400)
    } else if (!validPassword) {
        throw new ResponseError(`invalid password`, 400)
    }

    let newUser: InsertUser = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    let createUser = await insertUser(sql, newUser)

    console.log(createUser)
    res.send(createUser);
});

const signIn = (sql: Sql) => asyncHandler(async (req: Request, res: Response) => {

    if (!req.body.email && !req.body.username) {
        throw new ResponseError('provide email or username.', 400)
    }

    if (!req.body.password) {
        throw new ResponseError('provide password.', 400)
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
        throw new ResponseError('incorrect password', 400)
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

const signOut = (sql: Sql) => asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization

    if (!token) {
        throw new ResponseError('missing token', 401)
    }

    const expireToken = await sql`
        update sessions
        set
            expires_at = ${new Date(new Date().getTime())}
        where token = ${token}
        returning * `

    if (expireToken.length == 0) {
        throw new ResponseError('no coressponding session found', 404)
    }

    console.log(expireToken)
    res.json(expireToken)
});

export { listUsers, getUser, user as deleteUser, updateUser, signUp, signIn, signOut }
