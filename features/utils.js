'use strict';
const https = require("https");
const { AppError, errorIdentification } = require("./errorHandling");

// Automatic update checking
function queryLatestVersion() {
    return new Promise(function (resolve, reject) {
        const url = "https://registry.npmjs.com/code-template-generator/latest";
        const options = {
            timeout: 6000
        };

        https.get(url, options, (response) => {
            response.setEncoding("utf8");

            let rawData = "";
            response.on("data", (chunk) => {
                rawData += chunk;
            });

            response.on("end", () => {
                const parsedData = JSON.parse(rawData);
                const latestVersion = parsedData.version;

                return resolve(latestVersion);
            });

        }).on("error", (err) => reject(err));
    });
}

function installedVersion() {
    return new Promise(function (resolve, reject) {
        const { version } = require("../package.json") || '';

        if (version && version.length > 0)
            return resolve(version);
        else
            return reject(new AppError("i001"));
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

                    return resolve(versionInfo);
                } else {
                    return reject(new AppError("i002"));
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
    return new Promise(function (resolve, reject) {
        const { regularExpression } = require("../common/");

        if (!input) {
            return reject(new AppError("n002"));
        }

        if (regularExpression.test(input)) {
            return resolve(true);
        } else {
            return reject(new AppError("n001"));
        }
    });
}

/**
 * @param {string} input
 */
function validateInputPath(input) {
    return new Promise(function (resolve, reject) {
        const { pathRegExr } = require("../common/");

        if (!input) {
            return reject(new AppError("pa002"));
        }

        if (pathRegExr.test(input)) {
            return resolve(true);
        } else {
            return reject(new AppError("pa001"));
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
                            return reject(errorIdentification(error));
                        }

                        resolvingContent = `\n\x1b[32mDone!\x1b[0m npm ${stdout}`;

                        if (stderr) {
                            resolvingContent += `\n\x1b[35mInformation\x1b[0m: ${stderr}`;
                        }

                        return resolve({ message: resolvingContent });
                    });

                } else {
                    resolvingContent = `The latest stable version ${installed} already installed`;
                    return resolve({ message: resolvingContent });
                }
            })
            .catch((err) => reject(errorIdentification(err)));
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
