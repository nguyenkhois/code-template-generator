/**
 * "optionList" is a global () variable in this app.
 * View more about Nodejs global object here:
 * https://nodejs.org/api/globals.html#globals_global
 */

// Using the "global" object in Node.js
global.optionList = [];

let supportedSubFlag = [];

function optionDefinition(flag) {
    return function (alias = "") {
        return function (description = "") {
            return optionList = optionList.concat([{
                "flag": flag,
                "alias": alias,
                "description": description,
                "subFlag": []
            }]);
        };
    };
}

function optionSubFlag(flag) {
    return function (subFlag) {
        return function (description = "") {
            const optionIndex = optionList.findIndexByProperty("flag", flag);
            if (optionIndex > -1) {
                optionList[optionIndex] = {
                    ...optionList[optionIndex],
                    subFlag: [
                        ...optionList[optionIndex].subFlag,
                        {
                            "flag": subFlag,
                            "description": description
                        }
                    ]
                };
            }
        };
    };
}

function getSubFlag() {
    optionList.map((option) => {
        if (option.subFlag.length > 0) {
            option.subFlag.map((subFlag) => {
                if (supportedSubFlag.indexOf(subFlag.flag) === -1) {
                    supportedSubFlag = supportedSubFlag.concat([subFlag.flag]);
                }
            });
        }
    });
}

function optionIdentification(inputArg, optionArr = optionList) {
    const flagPosition = inputArg.indexOf("-");
    let howToFind = -1;

    if (flagPosition === 0) {
        if (inputArg.indexOf("-", 1) === 1) {
            howToFind = 1; // Find by alias flag "--"
        } else {
            howToFind = 0; // Find by main flag "-"
        }
    } else {
        return -1; // Exit immediately this function identification()
    }

    switch (howToFind) {
        case 0:
            const seekingMainFlag = optionArr.filter(objItem => objItem["flag"] === inputArg);
            if (seekingMainFlag.length > 0) {
                return seekingMainFlag[0].flag;
            }

            return -1; // Not found

        case 1:
            const seekingAliasFlag = optionArr.filter(objItem => objItem["alias"] === inputArg);
            if (seekingAliasFlag.length > 0) {
                return seekingAliasFlag[0].flag;
            }

            return -1; // Not found

        default:
            return -1;
    }
}

function optionParse() {
    // Option definition - (<flag>)([alias])([description])
    optionDefinition("-root")()("Root for the command"); // Special case
    optionDefinition("-g")("--git")("Run git init and generate a .gitignore file");
    optionDefinition("-c")("--component")("Generate a React component file (*.js, *.jsx)");
    optionDefinition("-r")("--redux-component")("Generate a React-Redux component file (*.js, *.jsx)");
    optionDefinition("-fc")("--full-component")("Generate a full React component (*.css, *.js)");
    optionDefinition("-fr")("--full-redux-component")("Generate a full React-Redux component (*.css, *.js)");
    optionDefinition("-i")("--gitignore")("Generate a .gitignore file");
    optionDefinition("-v")("--version")("View the installed version");
    optionDefinition("-help")("--help")("View the help information");
    optionDefinition("-u")("--update")("Install the latest stable version");

    // Sub flag definition - (<main-flag>)(<sub-flag>)([sub-flag-description])
    optionSubFlag("-root")("--no-install")();
    optionSubFlag("-g")("--no-install")("No install dependencies when a project is generated");

    /**
     * Get all supported sub flags and store them into an array for the command analysis
     * -> commandParse()
     */
    getSubFlag();
}

function commandParse(processArgv) {
    const commandArr = processArgv.slice(2, process.argv.length) || [];
    const commandLength = commandArr.length;
    const defaultReturn = {
        firstArgument: null,
        lastArgument: null,
        subFlag: [],
        commandLength: 0
    };

    if (commandLength > 0) {
        let subFlag = [];
        let firstArgument = null;

        const betweenArgument =
            commandLength > 2 ?
                commandArr.slice(1, commandLength - 1) :
                null;

        const lastArgument =
            commandLength > 1 ?
                commandArr[commandLength - 1] :
                null;

        // Process the first argument
        if (optionIdentification(commandArr[0]) !== -1) {
            // Identification and converting to main flag if the user has used alias flag '--'
            firstArgument = optionIdentification(commandArr[0]);
        } else if (supportedSubFlag.indexOf(commandArr[0]) > -1) {
            // Catch the sub flag if it is found in the first position
            if (subFlag.indexOf(commandArr[0]) === -1) {
                subFlag = subFlag.concat([commandArr[0]]);
            }
        } else {
            firstArgument = commandArr[0];
        }

        if (betweenArgument !== null && betweenArgument.length > 0) {
            betweenArgument.map((item) => {
                if (supportedSubFlag.indexOf(item) > -1) {
                    if (subFlag.indexOf(item) === -1) {
                        subFlag = subFlag.concat([item]);
                    }
                }
            });
        }

        return {
            ...defaultReturn,
            "firstArgument": supportedSubFlag.indexOf(firstArgument) > -1 ? null : firstArgument,
            "lastArgument": lastArgument,
            "subFlag": subFlag,
            "commandLength": commandLength
        };
    }

    return defaultReturn;
}

module.exports = {
    command: { parse: commandParse },
    option: { parse: optionParse }
};
