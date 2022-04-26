const fs = require('fs');
const path = require('path');
const basePath = process.cwd();
const buildDir = `${basePath}/../build/json`;
const console = require('console');
const metadataList = [];

const getJsons = (_dir) => {
    try {
        return fs
            .readdirSync(_dir)
            .filter((item) => {
                let extension = path.extname(`${_dir}${item}`);
                if (extension === '.json' && item !== '_metadata.json') {
                    return item;
                }
            })
            .sort((a, b) => {
                const getFileName = (item) => item.split('.')[0];
                const _a = Number(getFileName(a));
                const _b = Number(getFileName(b));
                if (_a && _b) {
                    return _a - _b;
                }
            })
            .map((i) => {
                return {
                    filename: i,
                    path: `${_dir}/${i}`,
                };
            });
    } catch {
        return null;
    }
};

const loadJsonData = async (_jsonObject) => {
    try {
        const json = fs.readFileSync(_jsonObject.path);
        return JSON.parse(json);
    } catch (error) {
        console.error('Error loading json:', error);
    }
};

const writeMetaData = (_data) => {
    fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
    console.log('Generated _metadata.json file!');
};

const startCreating = async () => {
    const jsons = getJsons(buildDir);
    if (jsons == null) {
        console.log('Please generate jsons first.');
        return;
    }
    let loadedJsonObjects = [];
    jsons.forEach(async (jsonObject) => {
        loadedJsonObjects.push(loadJsonData(jsonObject));
    });
    await Promise.all(loadedJsonObjects).then((loadedJsonObjectArray) => {
        loadedJsonObjectArray.forEach((loadedJsonObject) => {
            metadataList.push(loadedJsonObject);
        });
    });
    writeMetaData(JSON.stringify(metadataList, null, 2));
};

startCreating();
