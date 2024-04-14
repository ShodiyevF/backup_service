const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

function compressDb(fileName) {
    return new Promise( async (resolve, reject) => {
        const output = fs.createWriteStream('./backups/archive.zip')
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        
        output.on('close', () => {
            resolve(path.join(process.cwd(), '/backups/archive.zip'))
        });
        
        archive.pipe(output);
        
        const picturesDirectory = path.join(process.cwd(), '/backups/')
        
        archive.append(fs.createReadStream(picturesDirectory+fileName), { name: fileName });
        archive.finalize();
    })
}

module.exports = {
    compressDb
}