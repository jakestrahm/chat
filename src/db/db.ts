import dotenv from 'dotenv';
import postgres, { Sql } from 'postgres'

dotenv.config();

export const sql: Sql = postgres(`${process.env.DATABASE_URL}`, {
    debug: (connection, query, parameters) => {
        console.log('connection: ', connection);
        console.log('query: ', query);
        console.log('parameters: ', parameters);
    }
});
