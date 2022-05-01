// generate json metadata from png's images
const basePath = process.cwd();
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');

const imagesFilePath = `${basePath}/metadata_from_png_images`;
const metadataFilePath = `${basePath}/metadata_from_png_metadata/`;
const alreadyGeneratedMetadataCsvFilePath = '/Users/michaelmalaspina/Documents/code/PicciottiNFT/Collection/Metadata.csv';

const config = {
    metadataFilesHaveExtension: false, // true if the metadata files have the ".json" extension
    startingId: 30000,
};

let itemsGenderJson = null;

// translate cell number color
const translateCellNumberColor = (initialColor) => {
    switch (initialColor) {
        case 'GIALLO':
            return 'Yellow';
        case 'ROSSO':
            return 'Red';
        case 'BIANCO':
            return 'White';

        default:
            break;
    }
};

// uppercase string first letter
const capitalizeTheFirstLetterOfEachWord = (words) => {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(' ');
};

// get itemsGenderJson from alreadyGeneratedMetadataCsvFilePath
const getItemsGenderJson = () => {
    return new Promise((res, rej) => {
        const data = fs.readFileSync(alreadyGeneratedMetadataCsvFilePath);

        csvParse.parse(data, { columns: false, trim: true }, function (err, rows) {
            // Your CSV data is in an array of arrys passed to this callback as rows.
            if (err) {
                console.error(err);
                rej(err);
            } else {
                const initialResult = rows
                    .filter((e) => e[0].includes('trait_type'))
                    .map((e) => {
                        const data = JSON.parse(e[0]);
                        return {
                            name: data.find((e) => e.trait_type === 'Picciotto').value.trim(),
                            gender: data.find((e) => e.trait_type === 'Gender').value,
                        };
                    })
                    .filter((value, index, self) => {
                        const _value = JSON.stringify(value);
                        const result =
                            index ===
                            self.findIndex((obj) => {
                                return JSON.stringify(obj) === _value;
                            });
                        return result;
                    });
                res([
                    ...initialResult,
                    {
                        name: 'Teddy',
                        gender: 'Male',
                    },
                    {
                        name: 'Logan',
                        gender: 'Male',
                    },
                    {
                        name: 'Din',
                        gender: 'Male',
                    },
                    {
                        name: 'Don',
                        gender: 'Male',
                    },
                    {
                        name: 'Ramon',
                        gender: 'Male',
                    },
                    {
                        name: 'Alisha',
                        gender: 'Female',
                    },
                    {
                        name: 'Olga',
                        gender: 'Female',
                    },
                    {
                        name: 'Svetlana',
                        gender: 'Female',
                    },
                    {
                        name: 'Irina',
                        gender: 'Female',
                    },
                ]);
            }
        });
    });
};

// get metadata file name from image file name
const getMetadataFileName = (imageFileName) => {
    if (config.metadataFilesHaveExtension) {
        return imageFileName.replace('.png', '.json');
    } else {
        return imageFileName.split('.')[0];
    }
};

// get item gender from itemsGenderJson
const getItemGender = (itemName) => {
    return itemsGenderJson.find((e) => e.name === itemName).gender;
};

// get present items metadata from input file
const getPresentItemsMetadata = () => {
    try {
        return fs
            .readdirSync(imagesFilePath)
            .filter((item) => {
                let extension = path.extname(`${imagesFilePath}${item}`);
                if (extension === '.png') {
                    return item;
                }
            })
            .map((e, i) => {
                const cellId = e.split('_')[0];
                const picciotto = capitalizeTheFirstLetterOfEachWord(e.split('_')[1].split('BN')[0].trim().toLowerCase());
                const _cellNumberColor = e.split('_')[1].split('BN')[1].split('.')[0].trim();
                const cellNumberColor = translateCellNumberColor(_cellNumberColor);
                console.log(`${e} cellNumberColor: ${cellNumberColor}`);

                return {
                    metadataFileName: getMetadataFileName(e),
                    metadataJson: {
                        dna: i + '0000000000000000000072' + cellId,
                        name: `#${config.startingId + i}`,
                        description:
                            'The Picciotti Wanted is a collection of 10,000 unique Picciotti NFTs— unique digital collectibles living on the Ethereum blockchain. Each nft in the collection grants access to members-only benefits. Future perks can be unlocked by the community through roadmap activation. Visit www.picciottiwanted.com for more details.',
                        image: 'ipfs://NewUriToReplace',
                        picciottoId: config.startingId + i,
                        date: Date.now(),
                        attributes: [
                            { trait_type: 'Picciotto', value: picciotto, display_type: '' },
                            { trait_type: 'Background', value: 'Prison B/W', display_type: '' },
                            { trait_type: 'Gender', value: getItemGender(picciotto), display_type: '' },
                            { trait_type: 'Jail_cell_number', value: '72' + cellId, display_type: '' },
                            { trait_type: 'Jail_cell_number_color', value: cellNumberColor, display_type: '' },
                        ],
                    },
                };
            });
    } catch (err) {
        console.error(err);
        return null;
    }
};

// write metadata json files
const writeMetadataJsonFiles = (presentItemsMetadata) => {
    for (let item of presentItemsMetadata) {
        fs.mkdirSync(metadataFilePath, { recursive: true });
        fs.writeFileSync(metadataFilePath + item.metadataFileName, JSON.stringify(item.metadataJson));
        console.log('\nmetadata file created in path:', metadataFilePath + item.metadataFileName);
    }
};

// start creating metadata files
const start = async () => {
    console.log('getting itemsGenderJson...');
    itemsGenderJson = await getItemsGenderJson();
    console.log('itemsGenderJson got!');
    const presentItemsMetadata = getPresentItemsMetadata();
    console.log(
        'presentItemsMetadata:',
        presentItemsMetadata.map((e) => e.metadataJson.name)
    );
    console.log('presentItemsMetadata number:', presentItemsMetadata.length);
    writeMetadataJsonFiles(presentItemsMetadata);
};

start();
