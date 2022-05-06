const basePath = process.cwd();
const fs = require('fs');
const path = require('path');

const inputPath = `${basePath}/tools_input/`;
const outputPath = `${basePath}/tools_output/`;

//edit to read the correct file
const filePathToRead = '/Users/michaelmalaspina/Documents/code/PicciottiNFT/Collection/Fixed collection/output_metadata/_metadata.json';

// can be "PATH_CONTENT_PSD_FILE_NAMES_IN_CSV" or "PATH_CONTENT_FILE_NAMES_IN_CSV" or "MERGE_MULTIPLE_CSV_FILES" or "GET_DUPLICATES_FROM_CSV_FILE" or "GET_SPECIFIC_FILES_FROM_METADATA.JSON_FILE_FILTERED_BY_B/W_PRISON"
const tool = 'GET_SPECIFIC_FILES_FROM_METADATA.JSON_FILE_FILTERED_BY_B/W_PRISON';

// get path files names in csv format (output directory is "tools_output")
const getPathContentPSDFileNamesInCSV = () => {
    const filesNames = fs
        .readdirSync(filePathToRead)
        .filter((e) => {
            const extension = path.extname(`${filePathToRead}${e}`);
            if (extension === '.psd' && e.includes('_')) {
                return e;
            }
        })
        .map((e) => {
            return e.split('_')[1].split('.')[0].toLowerCase();
        });
    const csvFile = filesNames.join(',');
    console.log('csvFile:', csvFile);
    fs.writeFileSync(outputPath + 'csv_file.csv', csvFile);
    console.log('csvFile created in path:', outputPath + 'csv_file.csv');
};

// get path files names in csv format (output directory is "tools_output")
const getPathContentFileNamesInCSVFromFiles = () => {
    const filesNames = fs.readdirSync(filePathToRead).map((e) => {
        return e.split('.')[0].toLowerCase();
    });
    const csvFile = filesNames.join(',');
    console.log('csvFile:', csvFile);
    fs.writeFileSync(outputPath + 'csv_file.csv', csvFile);
    console.log('csvFile created in path:', outputPath + 'csv_file.csv');
};

// merge multiple csv files in one unique file
const mergeMultipleCSVFiles = () => {
    let result = '';

    const filesNames = fs.readdirSync(inputPath).filter((e) => {
        const extension = path.extname(`${inputPath}${e}`);
        if (extension === '.csv') {
            return e;
        }
    });
    filesNames.forEach((fileName) => {
        const csv = fs.readFileSync(inputPath + fileName, 'utf-8');
        if (result === '') {
            result = result + csv;
        } else {
            result = result + ',' + csv;
        }
    });
    console.log('merged csv:', result);
    fs.writeFileSync(outputPath + 'merged_csv_file.csv', result);
    console.log('\ncsvFile created in path:', outputPath + 'merged_csv_file.csv');
};

//get duplicates from csv file
const findDuplicatedFromCSV = () => {
    const csv = fs.readFileSync(filePathToRead, 'utf-8');
    const csvArray = csv.split(',');
    const toFindDuplicates = (arry) => arry.filter((item, index) => arry.indexOf(item) !== index);
    const duplicates = toFindDuplicates(csvArray);
    console.log('duplicates:', duplicates);
};

//get specific files in path from _metadata.json
const getSpecificFilesFromMetadataJsonMasterFilteredByBWPrison = () => {
    const json = fs.readFileSync(filePathToRead);
    const parsedJson = JSON.parse(json);
    const filterdByPrison = parsedJson.filter((e) => e.attributes.some((att) => att.value === 'Prison B/W'));
    for (let file of filterdByPrison) {
        fs.copyFileSync(`/Users/michaelmalaspina/Documents/code/PicciottiNFT/Collection/Fixed collection/output/${file.picciottoId}.png`, outputPath + `${file.picciottoId}.psd`);
    }
};

const start = () => {
    if (tool === 'PATH_CONTENT_PSD_FILE_NAMES_IN_CSV') {
        getPathContentPSDFileNamesInCSV();
    } else if (tool === 'PATH_CONTENT_FILE_NAMES_IN_CSV') {
        getPathContentFileNamesInCSVFromFiles();
    } else if (tool === 'MERGE_MULTIPLE_CSV_FILES') {
        mergeMultipleCSVFiles();
    } else if (tool === 'GET_DUPLICATES_FROM_CSV_FILE') {
        findDuplicatedFromCSV();
    } else if (tool === 'GET_SPECIFIC_FILES_FROM_METADATA.JSON_FILE_FILTERED_BY_B/W_PRISON') {
        getSpecificFilesFromMetadataJsonMasterFilteredByBWPrison();
    } else {
        console.error('Please specify a valid tool name');
    }
};

start();
