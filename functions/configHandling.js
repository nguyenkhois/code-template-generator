'use strict';
const os = require("os");
const fs = require("fs");
const inquirer = require('inquirer');

const { validateInputPath } = require("./functions");
const { AppError } = require("./errorHandling");

const CURR_DIR = process.cwd();
const PLATFORM = process.platform; // ?
const HOME_DIR = os.homedir();

//console.log("Home dir:", os.homedir());

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

function storeConfigs(data, option = {}) {
    return new Promise((resolve, reject) => {
        if (Object.keys(option).length > 0) {

            // Store asset path
            if (option.subFlags !== undefined &&
                option.subFlags.indexOf("--set-asset") > -1) {

                validateInputPath(data)
                    .then(() => {
                        // Set config
                        if (fs.existsSync(data)) {
                            getConfigs(configFilePath)
                                .then((fileContents) => {
                                    let configs = JSON.parse(fileContents);

                                    configs = { ...configs, "userAssetPath": data };
                                    fs.writeFileSync(configFilePath, JSON.stringify(configs, null, '   '));

                                    resolve(data);
                                })
                                .catch((err) => reject(err));
                        } else {
                            reject(new AppError("pa004")); // The path is not found
                        }
                    })
                    .catch((err) => reject(err));

            } else {
                reject(new AppError("pa003")); // Unknown command or missing the sub option
            }
        } else {
            reject(new Error("Option is empty"));
        }
    });
}

/* getConfigs(configFilePath)
    .then((fileContents) => {
        const configs = JSON.parse(fileContents);

        if (Object.keys(configs).length > 0 &&
            configs.userAssetPath !== undefined &&
            configs.userAssetPath !== "") {

            const assetPath = configs.userAssetPath;
            getDirectoryContents(assetPath)
                .then((dirContents) => {
                    inquirer
                        .prompt([
                            {
                                type: 'checkbox',
                                message: 'Choose your assets',
                                name: 'userAssetList',
                                choices: dirContents || [],
                                validate: function (answer) {
                                    if (answer.length < 1) {
                                        return 'You must choose at least one asset or using Ctrl-C to break.';
                                    }

                                    return true;
                                }
                            }
                        ])
                        .then((answers) => {
                            answers.userAssetList.map((item) => {
                                const itemFullPath = `${assetPath}/${item}`;
                                const writePath = `${CURR_DIR}/${item}`;

                                const stats = fs.statSync(itemFullPath);

                                if (stats.isFile()) {
                                    const contents = fs.readFileSync(itemFullPath);
                                    fs.writeFileSync(writePath, contents);
                                } else if (stats.isDirectory()) {
                                    fs.mkdirSync(writePath);
                                    createDirectoryContents(itemFullPath, writePath);
                                }
                            });
                        });
                })
                .catch((err) => console.log(err.message));
        } else {
            console.log("You have not defined your asset directory");
        }
    })
    .catch((err) => console.log(err)); */

function retrieveAsset(filePath = configFilePath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, "utf8");
            const configs = JSON.parse(fileContents);

            if (Object.keys(configs).length > 0 &&
                configs.userAssetPath !== undefined &&
                configs.userAssetPath !== "") {

                const assetPath = configs.userAssetPath;
                getDirectoryContents(assetPath)
                    .then((dirContents) => {
                        inquirer
                            .prompt([
                                {
                                    type: 'checkbox',
                                    message: 'Choose your assets',
                                    name: 'userAssetList',
                                    choices: dirContents || [],
                                    validate: function (answer) {
                                        if (answer.length < 1) {
                                            return 'You must choose at least one asset or using Ctrl-C to break.';
                                        }

                                        return true;
                                    }
                                }
                            ])
                            .then((answers) => {
                                let resultArr = [];
                                let failArr = [];

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
                                            createDirectoryContents(itemFullPath, writePath);
                                        }
                                        resultArr = [...resultArr, item];
                                    } else {
                                        failArr = [...failArr, item];
                                    }
                                });

                                if (resultArr.length > 0) {
                                    resolve({ "done": resultArr, "fail": failArr });
                                } else {
                                    reject(new AppError("pa006")); // Can not retrieve asset
                                }
                            });
                    })
                    .catch((err) => reject(err));
            } else {
                reject(new AppError("pa005")); // The asset path is not defined
            }
        }
    });
}

function getDirectoryContents(sPath) {
    return new Promise((resolve) => {
        const filesToCreate = fs.readdirSync(sPath);
        let directoryContents = [];

        filesToCreate.forEach((item) => {
            directoryContents = [
                ...directoryContents,
                { "name": item }
            ];
        });

        resolve(directoryContents);
    });
}

async function createDirectoryContents(sourceDirPath, desDirPath) {
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
            createDirectoryContents(sourceItemPath, writePath);
        }
    });
}

module.exports = {
    storeConfigs,
    retrieveAsset
};