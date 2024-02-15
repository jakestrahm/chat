import {
	ColumnType,
	Generated,
	Insertable,
	JSONColumnType,
	Selectable,
	Updateable
} from 'kysely'

export interface Database {
	users: UsersTable
	rooms: RoomsTable
	messages: MessagesTable
}

export interface UsersTable {
	// Columns that are generated by the database should be marked
	// using the `Generated` type. This way they are automatically
	// made optional in inserts and updates.
	id: Generated<number>

	name: string
	email: string
	// If the column is nullable in the database, make its type nullable.
	// Don't use optional properties. Optionality is always determined
	// automatically by Kysely.
	// last_name: string | null

	// You can specify a different type for each operation (select, insert and
	// update) using the `ColumnType<SelectType, InsertType, UpdateType>`
	// wrapper. Here we define a column `created_at` that is selected as
	// a `Date`, can optionally be provided as a `string` in inserts and
	// can never be updated:
	// created_at: ColumnType<Date, string | undefined, never>

	// You can specify JSON columns using the `JSONColumnType` wrapper.
	// It is a shorthand for `ColumnType<T, string, string>`, where T
	// is the type of the JSON object/array retrieved from the database,
	// and the insert and update types are always `string` since you're
	// always stringifying insert/update values.
	// metadata: JSONColumnType<{
	//   login_at: string;
	//   ip: string | null;
	//   agent: string | null;
	//   plan: 'free' | 'premium';
	// }>
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export interface RoomsTable {
	id: Generated<number>
	name: string
	description: string
}
export type Room = Selectable<RoomsTable>
export type NewRoom = Insertable<RoomsTable>
export type RoomUpdate = Updateable<RoomsTable>

export interface MessagesTable {
	id: Generated<number>
	user_id: number
	room_id: number
	message: string
}
export type Message = Selectable<MessagesTable>
export type NewMessage = Insertable<MessagesTable>
export type MessageUpdate = Updateable<MessagesTable>
