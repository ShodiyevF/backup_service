const { fetchPsql } = require('../lib/pg')
const path = require('path')
const fs = require('fs')

const folderPath = path.join(process.cwd(), '/backups')

function uploadsInitFolder() {
    try {
        const checkFolder = fs.existsSync(folderPath)
        if (checkFolder) {
            return ''
        }

        return fs.mkdirSync(folderPath)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    uploadsInitFolder
}