const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const directoryPath = path.join(process.cwd(), '/backups');

function cleanDirectory() {
    cron.schedule('0 0 * * 0', async () => {
        fs.readdir(directoryPath, (err, files) => {
            const backupFiles = files.filter(file => file.startsWith('backup'));
            
            backupFiles.forEach(file => {
                fs.unlinkSync(`${directoryPath}/${file}`);
            });
        });
    })
}

module.exports = {
    cleanDirectory
}