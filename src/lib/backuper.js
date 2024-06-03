const { dbStatCheck, dbStatUpdate } = require('../config/db_stat');
const { formatDate } = require('./usefulfunctions');
const { compressDb } = require('./compressDb');
const { execute } = require('@getvim/execute');
const fs = require('fs')

const chatId = process.env.group_id

async function backuper(db, bot, psql, isFile = true) {
    try {
        const dbStat = await dbStatCheck(db.db_name, psql)

        if (dbStat.status == 'unmodificated' && dbStat.data.old_db_file_id != 0) {
            await bot.sendMessage(chatId, `<b>${db.db_name.toUpperCase()}</b> databazasida da o'zgarish bo'lmagan!`, {
                message_thread_id: db.db_topic_id,
                parse_mode: 'HTML'
            })
            return false
        }

        const checkFile = await fs.existsSync('/home/tgbotapi/backup_service/backups/'+db.srv_username)
        if (!checkFile) {
            fs.mkdirSync('/home/tgbotapi/backup_service/backups/'+db.srv_username)
        }
        
        const file_name = `${db.db_name}_backup.sql`;
        const command = `PGPASSWORD='${db.db_pasw}' pg_dump -h ${db.db_host} -U ${db.db_user} -d ${db.db_name} -p ${db.db_port} -f './backups/${db.srv_username}/${file_name}'`;
        await execute(command)
        if (isFile) {
            const commandFile = `scp -r -P ${db.srv_port} -i /home/tgbotapi/.ssh/${db.srv_ssh_key} ${db.srv_username}@${db.srv_host}:${db.srv_upload_folder} /home/tgbotapi/backup_service/backups/${db.srv_username}/`;
            await execute(commandFile)
        }
        
        const compressesDB = await compressDb(db.srv_username);
        const sendedBackupResponse = await bot.sendDocument(chatId, compressesDB, {
            caption: `<b>${db.db_name}</b> ${formatDate()}`,
            message_thread_id: db.db_topic_id,
            parse_mode: 'HTML'
        })
        dbStatUpdate(db.db_name, dbStat.data.insert, dbStat.data.update, dbStat.data.delete, sendedBackupResponse.document.file_id)
        fs.rmSync('/home/tgbotapi/backup_service/backups/'+db.srv_username, {
            force: true,
            recursive: true
        })
        fs.rmSync(compressesDB)
    
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    backuper
}