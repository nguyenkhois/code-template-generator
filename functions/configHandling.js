'use strict';
const { fs, inquirer, CURR_DIR, createDirectoryContents } = require("../common/");
const os = require("os");

const { validateInputPath } = require("./functions");
const { AppError } = require("./errorHandling");

const HOME_DIR = os.homedir();
const configFilePath = `${HOME_DIR}/code-template-generator.json`;

initialConfigFile();

function initialConfigFile() {
    return new Promise((resolve) => {
        if (!fs.existsSync(configFilePath)) {
            const defaultContents = {
                "description": "code-template-generator config file",
                "userAssetPath": ""
            };

            fs.writeFileSync(configFilePath, JSON.stringify(defaultContents, null, '   '));
            resolve(defaultContents);
        }
    });
}

function configHandling(data, option = {}) {
    return new Promise((resolve, reject) => {
        if (Object.keys(option).length > 0 && option.subFlags !== undefined) {

            if (option.subFlags.indexOf("--set-asset") > -1) {
                // --set-asset -> Store the asset path
                validateInputPath(data) // Local path validation
                    .then(() => {
                        if (fs.existsSync(data) && fs.statSync(data).isDirectory()) {
                            storeConfig({ "userAssetPath": data })
                                .then((result) => resolve({
                                    "subFlag": "--set-asset",
                                    "result": result.userAssetPath
                                }))
                                .catch((err) => reject(err));
                        } else {
                            reject(new AppError("pa004")); // The path is not found
                        }
                    })
                    .catch((err) => reject(err));

            } else if (option.subFlags.indexOf("--view-asset") > -1) {
                // --view-asset -> View the asset path
                getConfigInfo("userAssetPath", (err, assetPath) => {
                    if (!err) {
                        if (assetPath !== "") {
                            resolve({
                                "subFlag": "--view-asset",
                                "result": assetPath
                            });
                        } else {
                            reject(new AppError("pa005")); // The asset path is null = not defined
                        }
                    } else {
                        if (err.message === "undefined") {
                            reject(new AppError("pa005")); // The asset path is not defined
                        }

                        reject(err);
                    }
                });

            } else {
                reject(new AppError("pa003")); // Unknown command or missing the sub option
            }
        } else {
            reject(new Error("Option is empty or subFlags variable is undefined"));
        }
    });
}

function storeConfig(data) {
    return new Promise((resolve) => {
        const configFileContents = fs.readFileSync(configFilePath, "utf8");
        let configs = JSON.parse(configFileContents);

        configs = { ...configs, ...data };
        fs.writeFileSync(configFilePath, JSON.stringify(configs, null, '   '));

        resolve(data);
    });
}

function retrieveAsset() {
    return new Promise((resolve, reject) => {
        getConfigInfo("userAssetPath", (err, assetPath) => {
            if (!err) {
                if (assetPath !== "") {
                    getDirectoryContents(assetPath)
                        .then((dirContents) => {
                            if (dirContents.length > 0) {
                                inquirer
                                    .prompt([
                                        {
                                            type: 'checkbox',
                                            message: 'Choose your asset(s)',
                                            name: 'userAssetList',
                                            choices: dirContents || [],
                                            pageSize: 10,
                                            validate: function (answer) {
                                                if (answer.length < 1) {
                                                    return 'You must choose at least one asset or using Ctrl-C to break.';
                                                }

                                                return true;
                                            }
                                        }
                                    ])
                                    .then((answers) => {
                                        let passedArr = [];
                                        let failureArr = [];

                                        answers.userAssetList.map((item) => {
                                            const itemFullPath = `${assetPath}/${item}`;
                                            const writePath = `${CURR_DIR}/${item}`;

                                            const stats = fs.statSync(itemFullPath);

                                            if (!fs.existsSync(writePath)) {
                                                if (stats.isFile()) {
                                                    const contents = fs.readFileSync(itemFullPath);
                                                    fs.writeFileSync(writePath, contents);
                                                } else if (stats.isDirectory()) {
                                                    fs.mkdirSync(writePath);
                                                    createDirectoryContents(fs, itemFullPath, writePath);
                                                }
                                                passedArr = passedArr.concat([item]);
                                            } else {
                                                failureArr = failureArr.concat([item]);
                                            }
                                        });

                                        if (passedArr.length > 0) {
                                            resolve({ "passed": passedArr, "failure": failureArr });
                                        } else {
                                            reject(new AppError("pa006")); // Can not retrieve asset
                                        }
                                    });
                            } else {
                                reject(new AppError("pa007")); // Empty directory
                            }
                        })
                        .catch((err) => reject(err));

                } else {
                    reject(new AppError("pa005")); // The asset path is null = not defined
                }
            } else {
                if (err.message === "undefined") {
                    reject(new AppError("pa005")); // The asset path is not defined
                }

                reject(err);
            }
        });
    });
}

function getDirectoryContents(sPath) {
    return new Promise((resolve) => {
        const filesToCreate = fs.readdirSync(sPath);
        let directoryContents = [];

        filesToCreate.forEach((item) => {
            directoryContents = directoryContents.concat([{ "name": item }]);
        });

        resolve(directoryContents);
    });
}

/**
 * Using callback
 * @param {*} name is property name in config file
 * @param {*} fnResult is callback function => (err, result)
 * @param {*} filePath is local file path
 */
function getConfigInfo(name, fnResult, filePath = configFilePath) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, "utf8");
            const configs = JSON.parse(fileContents);

            if (Object.keys(configs).length > 0) {
                if (configs[name] !== undefined) {
                    fnResult(null, configs[name]);
                } else {
                    fnResult(new Error("undefined"));
                }
            } else {
                fnResult(new Error("File is empty"));
            }
        } else {
            fnResult(new Error("File is not found"));
        }
    } catch (err) {
        fnResult(err);
    }
}

module.exports = {
    configHandling,
    retrieveAsset
};