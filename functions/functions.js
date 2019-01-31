const https = require("https");
const { errorIdentification } = require("./errorHandling");

// Automatic update check
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

        if (version !== undefined && version !== null && version.length > 0)
            resolve(version);
        else
            reject(new Error("i001"));
    });
}

function autoUpdateCheck() {
    return new Promise((resolve, reject) => {
        Promise.all([installedVersion(), queryLatestVersion()])
            .then((result) => {
                const versionInfo = {
                    isUpdateFound: result[0] === result[1] ? false : true,
                    installed: result[0],
                    latest: result[1]
                };

                resolve(versionInfo);
            })
            .catch((err) => reject(err));
    });
}

function validateInputName(input) {
    /**
     * Input data must be larger than 2 character.
     * Project name may only include letters, numbers, underscores and hashes.
     * Do NOT accept any special characters. View more at regularExpression in ../common/index.js.
     */
    const { regularExpression } = require("../common/");

    return new Promise(function (resolve, reject) {
        if (input === undefined || input === null || input === "") {
            reject(Error("n002"));
            return;
        }

        if (regularExpression.test(input)) {
            resolve(true);
        } else {
            reject(Error("n001"));
        }
    });
}

function checkAndInstallStableUpdate() {
    return new Promise((resolve, reject) => {
        let resolvingContent = "";

        autoUpdateCheck()
            .then((versionInfo) => {
                if (versionInfo.isUpdateFound) {
                    const exec = require("child_process").exec;

                    console.log(`\nInstalled version is ${versionInfo.installed}`);
                    console.log(`\nStarting installation for the latest stable version ${versionInfo.latest}...`);
                    exec("npm i -g code-template-generator", (error, stdout, stderr) => {
                        if (error) {
                            reject(errorIdentification(error));
                            return;
                        }

                        resolvingContent = `\n\x1b[32mDone!\x1b[0m npm ${stdout}`;

                        if (stderr !== "") {
                            resolvingContent += `\n\x1b[35mInformation\x1b[0m: ${stderr}`;
                        }

                        resolve({ message: resolvingContent });
                    });

                } else {
                    resolvingContent = `You have installed the latest stable version ${versionInfo.installed}`;
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
    validateInputName
};
