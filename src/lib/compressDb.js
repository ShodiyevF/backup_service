const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

function compressDb(fileName) {
    return new Promise( async (resolve, reject) => {
        const output = fs.createWriteStream(`./zip/${fileName.split('.')[0]}_backup.zip`)
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        
        output.on('close', () => {
            resolve(path.join(process.cwd(), `./zip/${fileName.split('.')[0]}_backup.zip`))
        });
        
        archive.pipe(output);
        
        const picturesDirectory = path.join(process.cwd(), '/backups/'+fileName)
        for (const el of fs.readdirSync(picturesDirectory)) {
            if (el.includes('.')) {
                archive.append(fs.createReadStream(`${picturesDirectory}/${el}`), { name: el });
            } else {
                archive.directory(`${picturesDirectory}/${el}`, el);
            }
        }
        archive.finalize();
    })
}

module.exports = {
    compressDb
}