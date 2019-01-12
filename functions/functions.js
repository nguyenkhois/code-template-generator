const { errorCode } = require('./error-code');

// Automatic update check
function queryLatestVersion() {
    return new Promise(function (resolve, reject) {
        const https = require("https");
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
    return Promise.all([installedVersion(), queryLatestVersion()]);
}

// Print out the message
function printUpdateMessage(latestVersion) {
    const message = "\n" +
        "\t---------------------------------------------------\n" +
        `\t| \x1b[33mThe latest stable version ${latestVersion} is available\x1b[0m.   |\n` +
        `\t| Run \x1b[36mnpm i -g code-template-generator\x1b[0m to update. |\n` +
        "\t---------------------------------------------------\n";
    console.log(message);
}

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
                    '\n\t$ generate -help';
    return helpContent;
}

function validateInputName(input) {
    /**
     * Input data must be larger than 2 character.
     * Project name may only include letters, numbers, underscores and hashes.
     * Do NOT accept any special characters. View more at regularExpression in /functions/index.js.
     */
    const { regularExpression } = require('./');
    
    return new Promise(function (resolve, reject) {
        if (input === null){
            reject(Error("n002"));
            return;
        }

        if (regularExpression.test(input)){
            resolve(true);
        } else {
            reject(Error("n001"));
        }
    });
}

function filterByProperty(objectArray,sPropertyName,sSeekingValue){
    try{
        if (Array.isArray(objectArray)){
            if (objectArray.length > 0)
                return objectArray.filter(objItem => objItem[sPropertyName] === sSeekingValue);
            else
                return -1;
        }else
            return false
    }catch(e){return e}
}

// Print out message
function printOutResolve(result) {
    console.log(`\n\x1b[32mDone!\x1b[0m ${result.content} ${result.type} is generated successfully.`);
}

function printOutReject(error) {
    messageArray = filterByProperty(errorCode, 'code', error.code);

    if (messageArray.length === 1) {
        console.log(`\n\x1b[31mError!\x1b[0m ${messageArray[0].error}.`);
        console.log(`${messageArray[0].solution}.\n`);
    } else {
        // For general error
        console.log(`\n\x1b[31mError!\x1b[0m Error is found and the process is interrupted.\n`)
    }
}

module.exports = {
    installedVersion,
    queryLatestVersion,
    autoUpdateCheck,
    printUpdateMessage,
    helpInformation,
    validateInputName,
    filterByProperty,
    printOutResolve,
    printOutReject
}