require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.bot_token, { polling: true, baseApiUrl: 'http://localhost:8081' })
const { initializeFolder } = require('./config/default.folders');
const { cleanDirectory } = require('./config/cleanDirectory');
const { backupRunner } = require('./modules/backup.runner');
const { dbStatInitFile } = require('./config/db_stat');

async function initializer() {
    initializeFolder()
    dbStatInitFile()

    backupRunner(bot)
    cleanDirectory()
}


initializer()