/**
 * "CTGOptionList" is a global () variable is only using for this app.
 * https://nodejs.org/api/globals.html#globals_global
 */

global.CTGOptionList = [];// Using the "global" object in Node.js
let supportedSubFlags = [];

// Main flag definition
function optionDefinition(flag) {
    return function (alias) {
        return function (description) {
            return CTGOptionList = CTGOptionList.concat([{
                "flag": flag,
                "alias": alias || "",
                "description": description || "",
                "subFlags": []
            }]);
        };
    };
}

// Sub flags definition
function optionSubFlag(flag) {
    return function (subFlag) {
        return function (description) {
            const optionIndex = CTGOptionList.findIndexByProperty("flag", flag);
            if (optionIndex > -1) {
                CTGOptionList[optionIndex] = {
                    ...CTGOptionList[optionIndex],
                    subFlags: [
                        ...CTGOptionList[optionIndex].subFlags,
                        {
                            "flag": subFlag,
                            "description": description || ""
                        }
                    ]
                };
            }
        };
    };
}

function getSupportedSubFlagList() {
    CTGOptionList.map((option) => {
        if (option.subFlags.length > 0) {
            option.subFlags.map((subFlag) => {
                if (supportedSubFlags.indexOf(subFlag.flag) === -1) {
                    supportedSubFlags = supportedSubFlags.concat([subFlag.flag]);
                }
            });
        }
    });
}

function optionIdentification(inputArg, optionArr = CTGOptionList) {
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

            break;

        case 1:
            const seekingAliasFlag = optionArr.filter(objItem => objItem["alias"] === inputArg);
            if (seekingAliasFlag.length > 0) {
                return seekingAliasFlag[0].flag;
            }

            break;

        default:
            return -1;
    }

    return -1; // Not found -> Unknown option
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

    // Sub flags definition - (<main-flag>)(<sub-flag>)([sub-flag-description])
    optionSubFlag("-root")("--no-install")("No install git support and dependencies when a project is generated");
    optionSubFlag("-g")("--no-install")("No install dependencies for generated project");

    // Using for the command analysis -> commandParse()
    getSupportedSubFlagList();
}

function commandParse(processArgv) {
    const commandArr = processArgv.slice(2, process.argv.length) || [];
    const commandLength = commandArr.length;
    const defaultReturn = {
        firstArgument: null,
        lastArgument: null,
        inputSubFlags: [],
        commandLength: 0
    };

    if (commandLength > 0) {
        let subFlags = [];
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
        const identifiedFirstArg = optionIdentification(commandArr[0]);
        if (identifiedFirstArg !== -1) {
            // Identification and converting to main flag if the user has used alias flag '--'
            firstArgument = identifiedFirstArg;
        } else if (supportedSubFlags.indexOf(commandArr[0]) > -1) {
            // Catch the sub flag if it is found in the first position
            if (subFlags.indexOf(commandArr[0]) === -1) {
                subFlags = subFlags.concat([commandArr[0]]);
            }
        } else {
            firstArgument = commandArr[0];
        }

        if (betweenArgument !== null && betweenArgument.length > 0) {
            betweenArgument.map((item) => {
                if (supportedSubFlags.indexOf(item) > -1 &&
                    subFlags.indexOf(item) === -1) {

                    subFlags = subFlags.concat([item]);
                }
            });
        }

        return {
            ...defaultReturn,
            "firstArgument": supportedSubFlags.indexOf(firstArgument) > -1 ? null : firstArgument,
            "lastArgument": lastArgument,
            "inputSubFlags": subFlags,
            "commandLength": commandLength
        };
    }

    return defaultReturn;
}


/**
 * @param {*} mainFlag = 'string'; // Ex: -g, -c
 * @param {*} inputSubFlags = ['string', 'string']; // Ex: --no-install
 * CTGOptionList = [{}, {}]; // Object array
 * => Return only all the sub flags that belong to the main flag.
 */
function filterSubFlagByMainFlag(mainFlag) {
    return function (inputSubFlags = []) {
        let filteredSubFlags = [];
        const mainFlagIndex = CTGOptionList.findIndexByProperty("flag", mainFlag);

        if (mainFlagIndex > -1 &&
            CTGOptionList[mainFlagIndex].subFlags.length > 0 &&
            inputSubFlags.length > 0) {

            const subFlags = CTGOptionList[mainFlagIndex].subFlags;
            inputSubFlags.map((item) => {
                if (subFlags.findIndexByProperty("flag", item) > -1) {
                    filteredSubFlags = filteredSubFlags.concat([item]);
                }
            });
        }

        return filteredSubFlags;
    };
}

module.exports = {
    command: { parse: commandParse },
    option: { parse: optionParse },
    subFlag: { filterByMainFlag: filterSubFlagByMainFlag }
};
