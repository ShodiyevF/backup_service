const Pg = require('pg');

const pool = new Pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.PGPASSWORD,
    database: process.env.DB_NAME
})

async function fetchPsql(query, ...arr){
    try {
        const client = await pool.connect()
        const result = await client.query(query, arr)
        client.release()
        return result.rows
    } catch (error) {
        console.log(error, 'fetchPsql');
    }
}

module.exports = {
    fetchPsql
}