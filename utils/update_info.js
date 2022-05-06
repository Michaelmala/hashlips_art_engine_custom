const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require('fs');

const { baseUri, description, namePrefix, network, solanaMetadata } = require(`${basePath}/src/config.js`);

const config = {
    metadataAreShuffled: true, // true if the metadata files are in the "shuffled_json" path
    metadataFilesHaveExtension: false, // true if the metadata files have the ".json" extension
};

const buildMetadataMasterFilePath = config.metadataAreShuffled ? `${basePath}/build/shuffled_json/_metadata.json` : `${basePath}/build/json/_metadata.json`;

// read json data
let rawdata = fs.readFileSync(config.metadataAreShuffled ? `${basePath}/build/shuffled_json/_metadata.json` : `${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
    if (network == NETWORK.sol) {
        item.name = `${namePrefix} #${item.edition}`;
        item.description = description;
        item.creators = solanaMetadata.creators;
    } else {
        item.name = `${namePrefix} #${item.edition}`;
        item.description = description;
        item.image = `${baseUri}/${item.edition}.png`;
    }
    fs.writeFileSync(
        config.metadataAreShuffled
            ? `${basePath}/build/shuffled_json/${item.edition}${config.metadataFilesHaveExtension ? '.json' : ''}`
            : `${basePath}/build/json/${item.edition}${config.metadataFilesHaveExtension ? '.json' : ''}`,
        JSON.stringify(item, null, 2)
    );
});

fs.writeFileSync(buildMetadataMasterFilePath, JSON.stringify(data, null, 2));

if (network == NETWORK.sol) {
    console.log(`Updated description for images to ===> ${description}`);
    console.log(`Updated name prefix for images to ===> ${namePrefix}`);
    console.log(`Updated creators for images to ===> ${JSON.stringify(solanaMetadata.creators)}`);
} else {
    console.log(`Updated baseUri for images to ===> ${baseUri}`);
    console.log(`Updated description for images to ===> ${description}`);
    console.log(`Updated name prefix for images to ===> ${namePrefix}`);
}
