const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

function importImages() {
    return new Promise( async (resolve, reject) => {
        const output = fs.createWriteStream('archive.zip')
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // archive.setPassword('!260923Hryordamchi*afA');
        
        output.on('close', () => {
            resolve(path.join(process.cwd(), '/archive.zip'))
        });
        
        archive.pipe(output);
        
        const picturesDirectory = path.join(process.cwd(), '../../backend_development/uploads')
        await fs.readdir(picturesDirectory, (err, files) => {            
            files.forEach(file => {
                const filePath = `${picturesDirectory}/${file}`;
                archive.append(fs.createReadStream(filePath), { name: file });
            });
            
            archive.finalize();
        });
    })
}

module.exports = {
    importImages
}