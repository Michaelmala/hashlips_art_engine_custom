const basePath = process.cwd();
const fs = require('fs');
const path = require('path');

const { namePrefix } = require(`${basePath}/src/config.js`);

const config = {
    shuffle: true, // the files should be in ascending order or shuffled, IF EXISTS EMPTY THE "shuffled_images" AND "shuffled_json" PATHS
    startingIndex: 1, // starting collection id if NOT using shuffle config
    zeroIndicized: true, // the collection ids should start from 0?
    includeJsonFilesExtensionOnRead: true, // include or not the ".json" file extension reading current metadata
    includeJsonFilesExtensionOnWrite: false, // include or not the ".json" file extension writing new metadata
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
                    const jsonFilePathRead = `${basePath}/build/json/${file.split('.')[0]}${config.includeJsonFilesExtensionOnRead ? '.json' : ''}`;
                    const jsonFilePathWrite = `${basePath}/build/json/${index}${config.includeJsonFilesExtensionOnWrite ? '.json' : ''}`;

                    const jsonFileData = fs.readFileSync(jsonFilePathRead);
                    const parsedJsonFileData = JSON.parse(jsonFileData);

                    if (jsonFileData && parsedJsonFileData) {
                        parsedJsonFileData[config.jsonNameAlias] = `${namePrefix} #${index}`;
                        parsedJsonFileData[config.jsonEditionAlias] = index;

                        fs.writeFileSync(jsonFilePathRead, JSON.stringify(parsedJsonFileData, null, 2));
                        console.log(`JSON file ${file.split('.')[0]}.json properties updated\n`);

                        fs.renameSync(imageFilePath, `${basePath}/build/images/${index}${imageFileExtension}`);
                        console.log(`Image file renamed from ${file} to ${index}${imageFileExtension}\n`);

                        fs.renameSync(jsonFilePathRead, jsonFilePathWrite);
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

//get collection lenght
const getCollectionLenght = () => {
    const folder = `${basePath}/build/images`;
    const files = fs.readdirSync(folder);
    const filteredFiles = files.filter((file) => {
        const imageFileExtension = path.extname(file);
        if (file && (imageFileExtension == '.png' || imageFileExtension == '.jpg')) return true;
    });
    return filteredFiles.length;
};

//get random integer number
const getRandomInt = (max) => {
    if (config.zeroIndicized) {
        const result = Math.round(Math.random() * max);
        if (result > 0) {
            return result - 1;
        } else {
            return result;
        }
    } else {
        let result = 0;
        while (result === 0) {
            result = Math.round(Math.random() * max);
        }
        return result;
    }
};

//get new index filtering the already used ids
const getNewIndex = (usedIds, collectionLenght) => {
    let newId = getRandomInt(collectionLenght);

    while (usedIds.includes(newId)) {
        newId = getRandomInt(collectionLenght);
    }

    return newId;
};

//reindex images and json file names and metadata id shuffled
const reindexFilesShuffle = () => {
    const usedIds = [];
    const collectionLenght = getCollectionLenght();
    let index = getRandomInt(collectionLenght);

    const folder = `${basePath}/build/images`;
    fs.readdir(folder, (err, files) => {
        if (err) {
            console.error(err);
        } else if (files) {
            files.forEach((file) => {
                const imageFileExtension = path.extname(file);
                if (file && (imageFileExtension == '.png' || imageFileExtension == '.jpg')) {
                    const imageFilePathRead = `${basePath}/build/images/${file}`;
                    const imageFilePathWrite = `${basePath}/build/shuffled_images/${index}${imageFileExtension}`;
                    const jsonFilePathRead = `${basePath}/build/json/${file.split('.')[0]}${config.includeJsonFilesExtensionOnRead ? '.json' : ''}`;
                    const jsonFilePathWrite = `${basePath}/build/shuffled_json/${index}${config.includeJsonFilesExtensionOnWrite ? '.json' : ''}`;

                    const jsonFileData = fs.readFileSync(jsonFilePathRead);
                    const parsedJsonFileData = JSON.parse(jsonFileData);

                    if (jsonFileData && parsedJsonFileData) {
                        parsedJsonFileData[config.jsonNameAlias] = `${namePrefix} #${index}`;
                        parsedJsonFileData[config.jsonEditionAlias] = index;

                        fs.writeFileSync(jsonFilePathRead, JSON.stringify(parsedJsonFileData, null, 2));
                        console.log(`JSON file ${file.split('.')[0]}.json properties updated\n`);

                        fs.mkdirSync(`${basePath}/build/shuffled_images/`, { recursive: true });
                        fs.renameSync(imageFilePathRead, imageFilePathWrite);
                        console.log(`Image file renamed from ${file} to ${index}${imageFileExtension}\n`);

                        fs.mkdirSync(`${basePath}/build/shuffled_json/`, { recursive: true });
                        fs.renameSync(jsonFilePathRead, jsonFilePathWrite);
                        console.log(`JSON file renamed from ${file.split('.')[0]}.json to ${index}.json\n`);

                        usedIds.push(index);
                        if (usedIds.length < collectionLenght) {
                            index = getNewIndex(usedIds, collectionLenght);
                        }
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

const start = () => {
    if (config.shuffle) {
        reindexFilesShuffle();
    } else {
        reindexFiles();
    }
};

start();
