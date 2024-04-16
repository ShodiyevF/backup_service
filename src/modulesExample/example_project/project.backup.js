const { backuper } = require('../../lib/backuper');
const Pg = require('pg');

module.exports = function (bot) {
    const project = {
        db_host: 'host',
        db_port: 'port',
        db_user: 'user',
        db_pasw: 'password',
        db_name: 'database name',
        db_topic_id: 'group_topic_id'
    }

    const pool = new Pg.Pool({
        host: project.db_host,
        port: project.db_port,
        user: project.db_user,
        password: project.db_pasw,
        database: project.db_name
    })

    async function fetchPsql(query, ...arr){
        try {
            const client = await pool.connect()
            const result = await client.query(query, arr)
            client.release()
            return result.rows
        } catch (error) {
            console.log(error, 'fetchPsqlProjectname');
        }
    }

    backuper(project, bot, fetchPsql)
}