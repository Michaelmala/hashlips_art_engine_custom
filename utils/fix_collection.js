const basePath = process.cwd();
const fs = require('fs');
const path = require('path');

const { namePrefix } = require(`${basePath}/src/config.js`);

const config = {
    startingIndex: 1,
    jsonNameAlias: 'name',
    jsonEditionAlias: 'edition',
};

//reindex images and json file names and metadata id
const reindexFiles = () => {
    let index = config.startingIndex;

    const folder = `${basePath}/build/images`;
    fs.readdir(folder, (err, files) => {
        if (err) {
            console.error(err);
        } else if (files) {
            files.forEach((file) => {
                const imageFileExtension = path.extname(file);
                if (file && (imageFileExtension == '.png' || imageFileExtension == '.jpg')) {
                    const imageFilePath = `${basePath}/build/images/${file}`;
                    const jsonFilePath = `${basePath}/build/json/${file.split('.')[0]}.json`;
                    const jsonFileData = fs.readFileSync(jsonFilePath);
                    const parsedJsonFileData = JSON.parse(jsonFileData);

                    if (jsonFileData && parsedJsonFileData) {
                        parsedJsonFileData[config.jsonNameAlias] = `${namePrefix} #${index}`;
                        parsedJsonFileData[config.jsonEditionAlias] = index;

                        fs.writeFileSync(jsonFilePath, JSON.stringify(parsedJsonFileData, null, 2));
                        console.log(`JSON file ${file.split('.')[0]}.json properties updated\n`);

                        fs.renameSync(imageFilePath, `${basePath}/build/images/${index}${imageFileExtension}`);
                        console.log(`Image file renamed from ${file} to ${index}${imageFileExtension}\n`);

                        fs.renameSync(jsonFilePath, `${basePath}/build/json/${index}.json`);
                        console.log(`JSON file renamed from ${file.split('.')[0]}.json to ${index}.json\n`);

                        index++;
                    } else {
                        return;
                    }
                }
            });
        } else {
            console.warn('No file found');
        }
    });
};

reindexFiles();
