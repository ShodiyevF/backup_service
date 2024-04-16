const { fetchPsql } = require('../lib/pg')
const path = require('path')
const fs = require('fs')

const folderPath = path.join(process.cwd(), '/backups')
const folderZipPath = path.join(process.cwd(), '/zip')

function initFolder(path) {
    try {
        const checkFolder = fs.existsSync(path)
        if (checkFolder) {
            return ''
        }

        return fs.mkdirSync(path)
    } catch (error) {
        console.log(error);
    }
}

function initializeFolder() {
    initFolder(folderPath)
    initFolder(folderZipPath)
}

module.exports = {
    initializeFolder
}