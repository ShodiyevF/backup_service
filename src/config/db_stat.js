const { fetchPsql } = require('../lib/pg')
const path = require('path')
const fs = require('fs')

const filePath = path.join(process.cwd(), '/db_stat.json')

function dbStatInitFile() {
    try {
        const checkFile = fs.existsSync(filePath)
        if (checkFile) {
            return ''
        }

        return fs.writeFileSync(filePath, JSON.stringify({
            insert: 0,
            update: 0,
            delete: 0,
            old_db_file_id: 0
        }, null, 4))
    } catch (error) {
        console.log(error);
    }
}

async function dbStatUpdate(inserted, updated, deleted, fileId) {
    try {
        return fs.writeFileSync(filePath, JSON.stringify({
            insert: inserted,
            update: updated,
            delete: deleted,
            old_db_file_id: fileId
        }, null, 4))
    } catch (error) {
        console.log(error);
    }
}

async function dbStatCheck() {
    try {
        const getOldStat = fs.readFileSync(filePath)
        const parseGetOldStat = await JSON.parse(getOldStat)
        const getLatestStat = await fetchPsql('select tup_inserted, tup_updated, tup_deleted from pg_stat_database where datname = $1', process.env.DB_NAME).then(data => data[0])

        if (
            parseGetOldStat.insert != getLatestStat.tup_inserted || 
            parseGetOldStat.update != getLatestStat.tup_updated || 
            parseGetOldStat.delete != getLatestStat.tup_deleted
        ) {
            return {
                status: "modificated",
                data: {
                    insert: getLatestStat.tup_inserted,
                    update: getLatestStat.tup_updated,
                    delete: getLatestStat.tup_deleted,
                    old_db_file_id: parseGetOldStat.old_db_file_id
                }
            }
        }

        return {
            status: "unmodificated",
            data: parseGetOldStat
        }
    } catch (error) {
        console.log(error);
    }   
}

module.exports = {
    dbStatInitFile,
    dbStatUpdate,
    dbStatCheck
}