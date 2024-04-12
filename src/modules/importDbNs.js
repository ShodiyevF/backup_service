const { formatDate } = require('../lib/usefulfunctions');
const { dbStatCheck, dbStatUpdate } = require('../config/db_stat');
const { exec } = require('child_process');
const cron = require('node-cron');
const path = require('path');

const chatId = process.env.group_id

async function importDb(bot) {
    try {
        const dbStat = await dbStatCheck()
        
        console.log(dbStat);
        if (dbStat.status == 'unmodificated' || dbStat.data.old_db_file_id == 0) {
            await bot.sendDocument(chatId, dbStat.data.old_db_file_id)
            return false
        }
        
        const DB_HOST = process.env.DB_HOST;
        const DB_USER = process.env.DB_USER;
        const DB_NAME = process.env.DB_NAME;
        const DB_PORT = process.env.DB_PORT;
        const file_name = `backup_${formatDate()}.sql`;
        const command = `pg_dump -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -p ${DB_PORT} -f ${file_name}`;
        
        exec(command, async (error, stdout, stderr) => {
            setTimeout( async () => {
                try {
                    const sendedBackupResponse = await bot.sendDocument(chatId, path.join(process.cwd(), file_name))
                    dbStatUpdate(dbStat.data.insert, dbStat.data.update, dbStat.data.delete, sendedBackupResponse.document.file_id)
                } catch (error) {
                    console.log(error);
                }
            }, 2000)
        });
    } catch (error) {
        console.log(error.message);
    }
}

async function importDbRunner(bot) {
    try {        
        cron.schedule('*/10 * * * * *', async () => {
            importDb(bot)
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    importDbRunner
}