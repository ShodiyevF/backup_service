const cronjob = require('node-cron')
const { backuper } = require('../lib/backuper')

function backupRunner(bot) {
    const test = {
        db_host: 'localhost',
        db_port: 5432,
        db_user: 'postgres',
        db_pasw: 'test',
        db_name: 'test',
        db_topic_id: 1
    }

    const pokiza = {
        db_host: 'localhost',
        db_port: 5432,
        db_user: 'postgres',
        db_pasw: 'test',
        db_name: 'pokiza_local',
        db_topic_id: 1
    }
    
    cronjob.schedule('* * * * *', () => {
        backuper(test, bot)
        backuper(pokiza, bot)
    })
}

module.exports = {
    backupRunner
}