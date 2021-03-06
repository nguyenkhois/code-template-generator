'use strict';
const os = require("os");

const { fs, inquirer, CURR_DIR } = require("../common/");
const { createDirectoryContents } = require("../helpers/");
const { validateInputPath } = require("./utils");
const { inputNameText, AppError } = require("./errorHandling");

const HOME_DIR = os.homedir();
const configFilePath = `${HOME_DIR}/code-template-generator.json`;

initialConfigFile();

function initialConfigFile() {
    if (!fs.existsSync(configFilePath)) {
        const defaultContents = {
            "description": "code-template-generator config file",
            "userAssetPath": ""
        };

        fs.writeFileSync(configFilePath, JSON.stringify(defaultContents, null, '   '));
    }
}

/**
 * @param {string} data
 * @param {object} option
 */
function configHandling(data, option = {}) {
    return new Promise((resolve, reject) => {
        const { subFlags } = option;

        if (subFlags && Array.isArray(subFlags)) {
            if (data && subFlags.indexOf("--set-asset") > -1) {
                // --set-asset -> Store the local path
                // Validation and checking for the directory existence
                validateInputPath(data)
                    .then(() => {
                        if (fs.existsSync(data) && fs.statSync(data).isDirectory()) {
                            storeConfig({ "userAssetPath": data })
                                .then((result) => resolve({
                                    "subFlag": "--set-asset",
                                    "result": result.userAssetPath
                                }))
                                .catch((err) => reject(err));
                        } else {
                            reject(new AppError("pa004")); // The local path is not found
                        }
                    })
                    .catch((err) => reject(err));

            } else if (subFlags.indexOf("--view-asset") > -1) {
                // --view-asset -> Show the asset local path
                getConfigInfo("userAssetPath", (err, assetPath) => {
                    if (!err) {
                        if (assetPath && assetPath.length > 0) {
                            resolve({
                                "subFlag": "--view-asset",
                                "result": assetPath
                            });
                        } else {
                            reject(new AppError("pa005")); // The local path is null = not defined
                        }
                    } else {
                        if (err.message === "undefined") {
                            reject(new AppError("pa005")); // The local path is not defined
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

/**
 * @param {object} data
 * @param {string} sPath
 */
function storeConfig(data, sPath = configFilePath) {
    return new Promise((resolve) => {
        const configFileContents = fs.readFileSync(sPath, "utf8");
        let configs = JSON.parse(configFileContents);

        configs = Object.assign(configs, data);
        fs.writeFileSync(sPath, JSON.stringify(configs, null, '   '));

        resolve(data);
    });
}

function retrieveAsset() {
    return new Promise((resolve, reject) => {
        getConfigInfo("userAssetPath", (err, assetPath) => {
            if (err) {
                if (err.message && err.message === "undefined") {
                    return reject(new AppError("pa005")); // The asset path is not defined
                }

                return reject(err);
            }

            const isWithinCurrentDir = findWithinCurrentDir(assetPath);

            if (assetPath && !isWithinCurrentDir) {
                getDirectoryContents(assetPath)
                    .then((dirContents) => {
                        if (dirContents.length > 0) {
                            inquirer
                                .prompt([
                                    {
                                        type: 'checkbox',
                                        message: `Choose your asset(s) from \x1b[36m${assetPath}\x1b[0m\n`,
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
                                    if (answers.userAssetList.length === 1) {
                                        inquirer.prompt([
                                            {
                                                type: 'input',
                                                name: 'changeToNewName',
                                                message: 'Do you want to change its name?',
                                                default: answers.userAssetList[0],
                                                validate: function (input) {
                                                    const regExr = /^(?![-])([A-Za-z-_.\d])+([A-Za-z\d])+$/;

                                                    if (regExr.test(input)) {
                                                        return true;
                                                    }

                                                    return inputNameText;
                                                }
                                            }
                                        ])
                                            .then((response) => {
                                                generateAsset(assetPath, answers.userAssetList, response.changeToNewName)
                                                    .then((result) => resolve(result))
                                                    .catch((err) => reject(err));

                                            })
                                            .catch((err) => reject(err));
                                    } else {
                                        generateAsset(assetPath, answers.userAssetList)
                                            .then((result) => resolve(result))
                                            .catch((err) => reject(err));
                                    }
                                });
                        } else {
                            reject(new AppError("pa007")); // Empty directory
                        }
                    })
                    .catch((err) => reject(err));

            } else if (assetPath && isWithinCurrentDir) {
                reject(new AppError("pa008")); // The asset directory in the current directory is not allow
            } else {
                reject(new AppError("pa005")); // The asset path is null = not defined
            }
        });
    });
}

function generateAsset(assetPath, arrAsset, changedName) {
    return new Promise((resolve, reject) => {
        const arrAssetLength = arrAsset.length;

        if (Array.isArray(arrAsset) && arrAssetLength) {
            let passedArr = [],
                failureArr = [];

            if (arrAssetLength === 1 && changedName.length) {
                // Allow the user changes the asset's name when choosing only one file or directory
                const assetFullPath = `${assetPath}/${arrAsset[0]}`;
                const writePath = `${CURR_DIR}/${changedName}`;

                writeAsset(changedName, assetFullPath, writePath, (result) => {
                    passedArr = passedArr.concat(result.passedItem);
                    failureArr = failureArr.concat(result.failureItem);
                });
            } else {
                arrAsset.map((itemName) => {
                    const itemFullPath = `${assetPath}/${itemName}`;
                    const writePath = `${CURR_DIR}/${itemName}`;

                    writeAsset(itemName, itemFullPath, writePath, (result) => {
                        passedArr = passedArr.concat(result.passedItem);
                        failureArr = failureArr.concat(result.failureItem);
                    });
                });
            }

            if (passedArr.length > 0) {
                resolve({ "passed": passedArr, "failure": failureArr });
            } else {
                reject(new AppError("pa006")); // Can not retrieve asset
            }
        } else {
            reject(new AppError("pa006"));
        }
    });
}

function writeAsset(itemName, itemFullPath, writePath, fnCallback) {
    let passedItem = [],
        failureItem = [];

    const stats = fs.statSync(itemFullPath);

    if (!fs.existsSync(writePath)) {
        if (stats.isFile()) {
            const contents = fs.readFileSync(itemFullPath);
            fs.writeFileSync(writePath, contents);
        } else if (stats.isDirectory()) {
            fs.mkdirSync(writePath);
            createDirectoryContents(fs, itemFullPath, writePath);
        }
        passedItem = passedItem.concat([itemName]);
    } else {
        failureItem = failureItem.concat([itemName]);
    }

    fnCallback({
        passedItem,
        failureItem
    });
}

/**
 * @param {string} sPath
 */
function getDirectoryContents(sPath) {
    return new Promise((resolve, reject) => {
        if (sPath && fs.existsSync(sPath) && fs.statSync(sPath).isDirectory()) {
            const filesToCreate = fs.readdirSync(sPath);
            let directoryContents = [];

            filesToCreate.forEach((item) => {
                directoryContents = directoryContents.concat([{ "name": item }]);
            });

            return resolve(directoryContents);
        }

        return reject(new AppError("pa004"));
    });
}

/**
 * @param {string} name is property name in config file
 * @param {callback} fnResult is a callback function => (err, result)
 * @param {string} filePath is local file path
 */
function getConfigInfo(name, fnResult, filePath = configFilePath) {
    try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const fileContents = fs.readFileSync(filePath, "utf8");
            const configs = JSON.parse(fileContents);

            if (Object.keys(configs).length > 0) {
                if (configs[name]) {
                    fnResult(undefined, configs[name]);
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

/**
 * @param {string} inputDir
 * @param {string} currentDir
 */
function findWithinCurrentDir(inputDir, currentDir = CURR_DIR) {
    if (inputDir && inputDir.length < currentDir.length) {
        if (currentDir.indexOf(inputDir) > -1) {
            return true;
        }
    } else if (inputDir.length === currentDir.length) {
        return true;
    }

    return false;
}

module.exports = {
    configHandling,
    retrieveAsset
};
