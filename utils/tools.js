const basePath = process.cwd();
const fs = require('fs');
const path = require('path');

const inputPath = `${basePath}/tools_input/`;
const outputPath = `${basePath}/tools_output/`;

//edit to read the correct file
const filePathToRead = '/Users/michaelmalaspina/Documents/code/PicciottiNFT/ULTIMI';

// can be "PATH_CONTENT_PSD_FILE_NAMES_IN_CSV" or "MERGE_MULTIPLE_CSV_FILES"
const tool = 'PATH_CONTENT_PSD_FILE_NAMES_IN_CSV';

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

const start = () => {
    if (tool === 'PATH_CONTENT_PSD_FILE_NAMES_IN_CSV') {
        getPathContentPSDFileNamesInCSV();
    } else if (tool === 'MERGE_MULTIPLE_CSV_FILES') {
        mergeMultipleCSVFiles();
    } else {
        console.error('Please specify a valid tool name');
    }
};

start();
