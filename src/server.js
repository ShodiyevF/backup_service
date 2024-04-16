require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.bot_token, { polling: true, baseApiUrl: 'http://localhost:8081' })
const { initializeFolder } = require('./config/default.folders');
const { cleanDirectory } = require('./config/cleanDirectory');
const { dbStatInitFile } = require('./config/db_stat');
const { backupRunner } = require('./backup.runner');

async function initializer() {
    initializeFolder()
    dbStatInitFile()

    backupRunner(bot)
    cleanDirectory()
}


initializer()