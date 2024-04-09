const { formatDate } = require('../lib/usefulfunctions');
const { exec } = require('child_process');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

function importDbRunnerElmakon(bot) {
    try {
        cron.schedule('59 23 * * *', async () => {
            
            process.env.PGPASSWORD = '!260923Psql*afA'
            const DB_HOST = process.env.DB_HOST;
            const DB_USER = process.env.DB_USER;
            const DB_NAME = process.env.DB_NAME2;
            const DB_PORT = process.env.DB_PORT;
            const file_name = `backup_elmakon_${formatDate()}.sql`;
            const command = `pg_dump -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -p ${DB_PORT} -f ${file_name}`;            

            exec(command, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${stderr}`);
                } else {
                    setTimeout(() => {
                        bot.sendDocument(process.env.group_id, path.join(process.cwd(), file_name))
                    }, 3000)
                }
            });
        })
    } catch (error) {
        console.log(error, 'error');
    }
}

module.exports = {
    importDbRunnerElmakon
}