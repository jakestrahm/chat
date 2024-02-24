type UserUpdate = {
	email?: string,
	username?: string
}

type NewUser = {
	username: string
	email: string
	password_hash: string
}
export { UserUpdate, NewUser }
