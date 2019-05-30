function createDirectoryContents(fs, sourceDirPath, desDirPath) {
    return new Promise((resolve) => {
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

        resolve();
    });
}

module.exports = {
    createDirectoryContents
};