import { Kysely, sql } from 'kysely'

const up = async (db: Kysely<any>): Promise<void> => {
	await db.schema
		.createTable('user')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('username', 'varchar', (col) => col.notNull())
		.addColumn('email', 'varchar', (col) => col.notNull())
		.addColumn('password_hash', 'varchar', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('room')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('user_id', 'integer', (col) => col.references('user.id'))
		.addColumn('name', 'varchar', (col) => col.notNull())
		.addColumn('description', 'varchar')
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('message')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('user_id', 'integer', (col) => col.references('user.id'))
		.addColumn('room_id', 'integer', (col) => col.references('room.id'))
		.addColumn('content', 'varchar', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('session')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('user_id', 'integer', (col) => col.references('user.id'))
		.addColumn('token', 'varchar(255)', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		//should i give a default value here?
		.addColumn('expires_at', 'timestamp', (col) => col.notNull())
		.execute()

	/* await db.schema
	  .createIndex('pet_owner_id_index')
	  .on('pet')
	  .column('owner_id')
	  .execute() */
}

const down = async (db: Kysely<any>): Promise<void> => {
	await db.schema.dropTable('message').execute()
	await db.schema.dropTable('room').execute()
	await db.schema.dropTable('session').execute()
	await db.schema.dropTable('user').execute()
}

export { up, down }
