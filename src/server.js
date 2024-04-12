require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.bot_token, { polling: true, baseApiUrl: 'http://localhost:8081' })
const { uploadsInitFolder } = require('./config/default.folders');
const { cleanDirectory } = require('./modules/cleanDirectory');
const { importDbRunner } = require('./modules/importDbNs');
const { dbStatInitFile } = require('./config/db_stat');

async function initializer() {
    uploadsInitFolder()
    dbStatInitFile()

    importDbRunner(bot)
    cleanDirectory()
}


initializer()