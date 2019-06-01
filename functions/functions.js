'use strict';
const https = require("https");
const { AppError, errorIdentification } = require("./errorHandling");

// Automatic update checking
function queryLatestVersion() {
    return new Promise(function (resolve, reject) {
        const url = "https://registry.npmjs.com/code-template-generator/latest";
        let latestVersion;

        https.get(url, (response) => {
            response.setEncoding("utf8");

            let rawData = "";
            response.on("data", (chunk) => {
                rawData += chunk;
            });

            response.on("end", () => {
                const parsedData = JSON.parse(rawData);
                latestVersion = parsedData.version;

                resolve(latestVersion);
            });

        }).on("error", (error) => {
            reject(error);
        });
    });
}

function installedVersion() {
    return new Promise(function (resolve, reject) {
        const { version } = require("../package.json");

        if (version && version.length > 0)
            resolve(version);
        else
            reject(new AppError("i001"));
    });
}

function autoUpdateCheck() {
    return new Promise((resolve, reject) => {
        Promise.all([installedVersion(), queryLatestVersion()])
            .then((result) => {
                if (result[0] && result[1]) {
                    const versionInfo = {
                        isUpdateFound: (result[0] !== result[1]),
                        installed: result[0],
                        latest: result[1]
                    };

                    resolve(versionInfo);
                } else {
                    reject(new AppError("i002"));
                }
            })
            .catch((err) => reject(err));
    });
}

/**
 * @param {string} input
 */
function validateInputName(input) {
    /**
     * Input data length must be larger than 2 character.
     * Project name may only include letters, numbers, underscores and hashes.
     * Do NOT accept any special characters. View more at regularExpression in ../common/index.js.
     */
    const { regularExpression } = require("../common/");

    return new Promise(function (resolve, reject) {
        if (!input) {
            reject(new AppError("n002"));
            return;
        }

        if (regularExpression.test(input)) {
            resolve(true);
        } else {
            reject(new AppError("n001"));
        }
    });
}

/**
 * @param {string} input
 */
function validateInputPath(input) {
    const { pathRegExr } = require("../common/");

    return new Promise(function (resolve, reject) {
        if (!input) {
            reject(new AppError("pa002"));
            return;
        }

        if (pathRegExr.test(input)) {
            resolve(true);
        } else {
            reject(new AppError("pa001"));
        }
    });
}

function checkAndInstallStableUpdate() {
    return new Promise((resolve, reject) => {

        autoUpdateCheck()
            .then((versionInfo) => {
                const { isUpdateFound, installed, latest } = versionInfo;
                let resolvingContent = "";

                if (isUpdateFound) {
                    const exec = require("child_process").exec;

                    console.log(`\nInstalled version is ${installed}`);
                    console.log(`\nStarting installation for the latest stable version ${latest}...`);
                    exec("npm i -g code-template-generator@latest", (error, stdout, stderr) => {
                        if (error) {
                            reject(errorIdentification(error));
                            return;
                        }

                        resolvingContent = `\n\x1b[32mDone!\x1b[0m npm ${stdout}`;

                        if (stderr) {
                            resolvingContent += `\n\x1b[35mInformation\x1b[0m: ${stderr}`;
                        }

                        resolve({ message: resolvingContent });
                    });

                } else {
                    resolvingContent = `The latest stable version ${installed} already installed`;
                    resolve({ message: resolvingContent });
                }
            })
            .catch((err) => {
                reject(errorIdentification(err));
            });
    });
}

module.exports = {
    installedVersion,
    queryLatestVersion,
    autoUpdateCheck,
    checkAndInstallStableUpdate,
    validateInputName,
    validateInputPath
};
