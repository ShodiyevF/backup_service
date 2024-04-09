require('dotenv').config()

const bot = new TelegramBot(process.env.bot_token, { polling: true })
const { cleanDirectory } = require('./modules/cleanDirectory');
const TelegramBot = require('node-telegram-bot-api');

// importDbRunnerNasiyasavdo(bot)
// importDbRunnerElmakon(bot)
// cleanDirectory()