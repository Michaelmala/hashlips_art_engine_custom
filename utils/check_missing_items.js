// check missing items from csv input file
const basePath = process.cwd();
const fs = require('fs');
const csvParse = require('csv-parse');

const presentItemsFilePath = `${basePath}/input_check_missing_items/present_items.csv`;
const toBePresentItemsFilePath = `${basePath}/input_check_missing_items/to_be_present_items.csv`;

const outputPath = `${basePath}/output_check_missing_items/`;

// get present items from input file
const getPresentItems = () => {
    return new Promise((res, rej) => {
        const data = fs.readFileSync(presentItemsFilePath);

        csvParse.parse(data, { columns: false, trim: true }, function (err, rows) {
            // Your CSV data is in an array of arrys passed to this callback as rows.
            if (err) {
                console.error(err);
                rej(err);
            } else {
                const mappedData = rows
                    .filter((e) => e[0].includes('trait_type'))
                    .map((e) => {
                        const parsedJson = JSON.parse(e[0]);
                        const nameJson = parsedJson.find((e) => e.trait_type === 'Picciotto');
                        const name = nameJson.value.toLowerCase().trim();
                        return name;
                    })
                    .filter((value, index, self) => self.indexOf(value) === index);

                res(mappedData);
            }
        });
    });
};

// get to be present items from input file
const getToBePresentItems = () => {
    return new Promise((res, rej) => {
        const data = fs.readFileSync(toBePresentItemsFilePath);

        csvParse.parse(data, { columns: false, trim: true }, function (err, rows) {
            // Your CSV data is in an array of arrys passed to this callback as rows.
            if (err) {
                console.error(err);
                rej(err);
            } else {
                res(rows[0].map((e) => e.trim()).filter((value, index, self) => self.indexOf(value) === index));
            }
        });
    });
};

// start searching missing items
const start = async () => {
    const presentItems = await getPresentItems();
    console.log('presentItems:', presentItems);
    console.log('presentItems number:', presentItems.length);
    const toBePresentItems = await getToBePresentItems();
    console.log('toBePresentItems:', toBePresentItems);
    console.log('toBePresentItems number:', toBePresentItems.length);
    const missingItems = [];

    for (let item of toBePresentItems) {
        if (!presentItems.includes(item)) {
            missingItems.push(item);
        }
    }

    console.log('missing items:', missingItems);
    const csvFile = missingItems.join(',');
    fs.writeFileSync(outputPath + 'missing_items_csv_file.csv', csvFile);
    console.log('\ncsvFile created in path:', outputPath + 'missing_items_csv_file.csv');
};

start();
