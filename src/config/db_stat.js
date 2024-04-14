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
        
        return fs.writeFileSync(filePath, JSON.stringify([]))
    } catch (error) {
        console.log(error);
    }
}

async function dbStatUpdate(db, inserted, updated, deleted, fileId) {
    try {
        const readDbStat = fs.readFileSync(filePath)
        const parseDbStat = JSON.parse(readDbStat)
        
        const searchDbStat = parseDbStat.find(data => data.db === db)
        if (!searchDbStat) {
            parseDbStat.push({
                db: db,
                insert: inserted,
                update: updated,
                delete: deleted,
                old_db_file_id: fileId
            })
            return fs.writeFileSync(filePath, JSON.stringify(parseDbStat, null, 4))
        }

        const indexOfDb = parseDbStat.indexOf(searchDbStat)
        parseDbStat.splice(indexOfDb === 0 ? 0 : indexOfDb, 1)
        parseDbStat.push({
            db: db,
            insert: inserted,
            update: updated,
            delete: deleted,
            old_db_file_id: fileId
        })
        
        return fs.writeFileSync(filePath, JSON.stringify(parseDbStat, null, 4))
    } catch (error) {
        console.log(error);
    }
}

async function dbStatCheck(db) {
    try {
        const getOldStat = fs.readFileSync(filePath)
        const parseGetOldStat = await JSON.parse(getOldStat)
        const getLatestStat = await fetchPsql('select tup_inserted, tup_updated, tup_deleted from pg_stat_database where datname = $1', db).then(data => data[0])

        const searchDbStat = parseGetOldStat.find(data => data.db === db)

        if (!searchDbStat) {
            dbStatUpdate(db, 0, 0, 0, 0)
        }
        
        if (
            searchDbStat.insert != getLatestStat.tup_inserted || 
            searchDbStat.update != getLatestStat.tup_updated || 
            searchDbStat.delete != getLatestStat.tup_deleted
        ) {
            return {
                status: "modificated",
                data: {
                    insert: getLatestStat.tup_inserted,
                    update: getLatestStat.tup_updated,
                    delete: getLatestStat.tup_deleted,
                    old_db_file_id: searchDbStat.old_db_file_id
                }
            }
        }
        
        return {
            status: "unmodificated",
            data: searchDbStat
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