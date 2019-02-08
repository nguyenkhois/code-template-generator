Array.prototype.findIndexByProperty = function (sPropertyName, sPropertyValue) {
    try {
        return this.findIndex(objItem => objItem[sPropertyName] === sPropertyValue);
    } catch (err) { return err; }
};

function filterByProperty(objectArray, sPropertyName, sSeekingValue) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(objectArray)) {
            reject(Error("Input data is not an array"));
            return;
        }

        resolve(objectArray.filter(objItem => objItem[sPropertyName] === sSeekingValue));
    });
}

async function createDirectoryContents(fs, sourceDirPath, desDirPath) {
    const filesToCreate = fs.readdirSync(sourceDirPath);

    filesToCreate.forEach((item) => {
        const sourceItemPath = `${sourceDirPath}/${item}`;
        const writePath = `${desDirPath}/${item}`;

        // get stats about the current file
        const stats = fs.statSync(sourceItemPath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(sourceItemPath);
            fs.writeFileSync(writePath, contents);
        } else if (stats.isDirectory()) {
            fs.mkdirSync(writePath);

            // recursive call
            createDirectoryContents(fs, sourceItemPath, writePath);
        }
    });
}

module.exports = {
    filterByProperty,
    createDirectoryContents
};
