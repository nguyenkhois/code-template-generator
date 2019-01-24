const https = require("https");
const { errorCode, errorIdentification } = require('./error-handling');
const { filterByProperty, supportedTemplate } = require('../common/');

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

        }).on('error', (error) => {
            reject(error);
        });
    });
}

function installedVersion() {
    return new Promise(function (resolve, reject) {
        const { version } = require('../package.json');

        if (version !== undefined && version !== null && version.length > 0)
            resolve(version);
        else
            reject(new Error('i001'));
    });
}

function autoUpdateCheck() {
    return new Promise((resolve, reject) => {
        Promise.all([installedVersion(), queryLatestVersion()])
            .then((result) => {
                if (result[0] === result[1]) {
                    resolve({ isFound: false, version: result[1], installed: result[0] });
                } else {
                    resolve({ isFound: true, version: result[1], installed: result[0] }); // A new update is available
                }
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
    const { regularExpression } = require('../common/');

    return new Promise(function (resolve, reject) {
        if (input === null) {
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
        autoUpdateCheck()
            .then((availability) => {
                if (availability.isFound) {
                    const exec = require("child_process").exec;

                    console.log(`\nInstalled version is ${availability.installed}`);
                    console.log(`\nStarting installation for the latest stable version ${availability.version}...`);
                    exec(`npm i -g code-template-generator`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`\x1b[31mERROR\x1b[0m: ${error}`);
                            reject(error);
                            return;
                        }

                        console.log(`\n\x1b[32mDone!\x1b[0m npm ${stdout}`);

                        if (stderr !== '') {
                            console.log(`\x1b[35mInformation\x1b[0m: ${stderr}`);
                        }

                        resolve(true);
                    });

                } else {
                    console.log('You have installed the latest version');
                    resolve(true);
                }

            })
            .catch((err) => {
                reject(errorIdentification(err));
            });
    });
}

// Print out the information
function helpInformation() {
    const helpContent = '\nCOMMAND:' +
        '\n\t$ generate [option] \x1b[33m<name>\x1b[0m' +
        '\n\nREQUIRED:' +
        '\n\t\x1b[33m<name>\x1b[0m\t\tIt is <project-name> or <component-name>' +
        '\n\nOPTION:' +
        '\n\t-g\t\tInstall automatically Git support and generate a .gitignore file' +
        '\n\t-c\t\tGenerate a React component file (*.js, *.jsx)' +
        '\n\t-r\t\tGenerate a React-Redux component file (*.js, *.jsx)' +
        '\n\t-fc\t\tGenerate a full React component (a directory with *.js, *.css)' +
        '\n\t-fr\t\tGenerate a full React-Redux component (a directory with *.js, *.css)' +
        '\n\t-i\t\tGenerate a .gitignore file' +
        '\n\t-v\t\tView the installed version' +
        '\n\t-help\t\tDisplay the help information' +
        '\n\nEXAMPLE:' +
        '\n\t$ generate \x1b[33mfirst-project\x1b[0m' +
        '\n\t$ generate -g \x1b[33msecond-project\x1b[0m' +
        '\n\t$ generate -c \x1b[33mSearchComponent.js\x1b[0m' +
        '\n\t$ generate -r \x1b[33mReviewComponent.jsx\x1b[0m' +
        '\n\t$ generate -fc \x1b[33mProductComponent\x1b[0m' +
        '\n\t$ generate -fr \x1b[33mCartComponent\x1b[0m' +
        '\n\t$ generate -i' +
        '\n\t$ generate -v' +
        '\n\t$ generate -help' +
        '\n\t$ generate -u';;
    return helpContent;
}

function printUpdateMessage(latestVersion) {
    const message = "\n" +
        "\t---------------------------------------------------\n" +
        `\t| \x1b[33mThe latest stable version ${latestVersion} is available\x1b[0m.   |\n` +
        `\t| Run \x1b[36mnpm i -g code-template-generator\x1b[0m to update. |\n` +
        "\t---------------------------------------------------\n";
    console.log(message);
}

function printOutResolve(result) {
    const regularExpression = /component/gi;
    const seekingComponentText = regularExpression.test(result.content);

    console.log(`\n\x1b[32mDone!\x1b[0m ` +
        `${result.content} ` +
        `${!seekingComponentText ? result.type + ' ' : ''}` +
        `is generated successfully.\n`);
}

/**
 * Structure
 * @param {*} error = {
 *      code: err.message
 * }
 */
function printOutReject(error) {
    filterByProperty(errorCode, 'code', error.code)
        .then((result) => {
            if (result.length === 1) {
                console.log(`\n\x1b[31mError!\x1b[0m ${result[0].error}.`);
                console.log(`${result[0].solution}.\n`);
            } else {
                // For general error
                console.log(`\n\x1b[31mError!\x1b[0m Error is found and the process is interrupted.\n`)
            }
        })
        .catch((err) => console.log(err.message));
}

function printOutGuideAfterGeneration(projectName, projectTemplate) {
    const beginMessage = '\x1b[32m' + 'SUCCESS! ' + '\x1b[0m' +
        'Your project ' + projectName + ' is generated successfully by the template ' + projectTemplate + '.' +
        '\n\n\t' + '\x1b[36m' + 'cd ' + projectName + '\x1b[0m' + ' to change into your project directory';

    let detailMessage = '\n';

    const endMessage = '\n\nView README.md for more information.' +
        '\n\nHappy coding! (^_^)';

    filterByProperty(supportedTemplate, 'name', projectTemplate)
        .then((result) => {
            if (result.length === 1) {
                switch (result[0].type) {
                    case 'react': // React project
                        detailMessage += '\n\t' + '\x1b[36m' + 'npm start ' + '\x1b[0m' + ' to start the local web server at http://localhost:9000' +
                            '\n\t' + '\x1b[36m' + 'npm run build ' + '\x1b[0m' + ' to compile your code';
                        break;

                    case 'express': // Express project
                        detailMessage += '\n\t' + '\x1b[36m' + 'npm start ' + '\x1b[0m' + ' to start the local web server at http://localhost:8000';
                        break;

                    default:
                        break;
                }
            }

            console.log(beginMessage + detailMessage + endMessage);
        })
        .catch((err) => console.log(err.message));
}

module.exports = {
    installedVersion,
    queryLatestVersion,
    autoUpdateCheck,
    checkAndInstallStableUpdate,
    printUpdateMessage,
    helpInformation,
    validateInputName,
    printOutResolve,
    printOutReject,
    printOutGuideAfterGeneration,
    errorIdentification
}