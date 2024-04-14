const { dbStatCheck, dbStatUpdate } = require('../config/db_stat');
const { formatDate } = require('./usefulfunctions');
const { compressDb } = require('./compressDb');
const { execute } = require('@getvim/execute');
const fs = require('fs')

const chatId = process.env.group_id

async function backuper(db, bot) {
    try {
        const dbStat = await dbStatCheck(db.db_name)

        console.log(dbStat);
        if (dbStat.status == 'unmodificated' && dbStat.data.old_db_file_id != 0) {
            await bot.sendMessage(chatId, `<b>${db.db_name.toUpperCase()}</b> databazasida da o'zgarish bo'lmagan!`, {
                parse_mode: 'HTML'
            })
            return false
        }
        
        const file_name = `${db.db_name}_backup.sql`;
        const command = `PGPASSWORD=${db.db_pasw} pg_dump -h ${db.db_host} -U ${db.db_user} -d ${db.db_name} -p ${db.db_port} -f './backups/${file_name}'`;

        const a = await execute(command)
        const compressesDB = await compressDb(file_name);
        const sendedBackupResponse = await bot.sendDocument(chatId, compressesDB, {
            caption: `<b>${db.db_name}</b> ${formatDate()}`,
            parse_mode: 'HTML'
        })
        dbStatUpdate(db.db_name, dbStat.data.insert, dbStat.data.update, dbStat.data.delete, sendedBackupResponse.document.file_id)
        fs.rmSync('./backups/'+file_name)
    
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    backuper
}