import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import Database from '../models/Database';

dotenv.config();
const dialect = new PostgresDialect({
	pool: new Pool({
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT || '5432'),
	})
})

export const db = new Kysely<Database>({
	dialect,
})

