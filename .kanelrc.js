const { makeKyselyHook } = require("kanel-kysely");
const dotenv = require('dotenv');
dotenv.config();

/** @type {import('kanel').Config} */
module.exports = {
	connection: {
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},

	preDeleteOutputFolder: true,
	outputPath: "./src/schemas",

	customTypeMap: {
		"pg_catalog.tsvector": "string",
		"pg_catalog.bpchar": "string",
	},
	preRenderHooks: [makeKyselyHook()],
};
