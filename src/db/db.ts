import dotenv from 'dotenv';
import postgres from 'postgres'

dotenv.config();


export const sql = postgres(`${process.env.DATABASE_URL}`, {
    debug: (connection, query, parameters) => {
        console.log('connection: ', connection);
        console.log('query: ', query);
        console.log('parameters: ', parameters);
    }
});
