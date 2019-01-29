/**
 * "optionList" is a global () variable in this app.
 * View more about Nodejs global object here:
 * https://nodejs.org/api/globals.html#globals_global
 */

// Using the "global" object in Node.js
global.optionList = [];

const supportedSubFlag = ["--no-install"];

function optionDefinition(flag) {
    return function (alias = "") {
        return function (description = "") {
            return optionList = optionList.concat([{
                "flag": flag,
                "alias": alias,
                "description": description
            }]);
        };
    };
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

// Option definition - (<flag>)([alias])([description])
function optionParse() {
    optionDefinition("-g")("--git")("Run automatically git init and generate a .gitignore file");
    optionDefinition("-c")("--component")("Generate a React component file (*.js, *.jsx)");
    optionDefinition("-r")("--redux-component")("Generate a React-Redux component file (*.js, *.jsx)");
    optionDefinition("-fc")("--full-component")("Generate a full React component (a directory with *.js, *.css)");
    optionDefinition("-fr")("--full-redux-component")("Generate a full React-Redux component (a directory with *.js, *.css)");
    optionDefinition("-i")("--gitignore")("Generate a .gitignore file");
    optionDefinition("-v")("--version")("View the installed version");
    optionDefinition("-help")("--help")("View the help information");
    optionDefinition("-u")("--update")("Checking and updating for the latest stable version");
}

function commandParse(processArgv) {
    const argumentArr = processArgv.slice(2, process.argv.length) || [];
    const argumentArrLength = argumentArr.length;
    const defaultReturn = {
        firstArgument: null,
        betweenArgument: null,
        lastArgument: null,
        subFlag: [],
        argumentArrLength: 0
    };

    if (argumentArrLength > 0) {
        const firstArgument =
            optionIdentification(argumentArr[0]) !== -1 ?
                optionIdentification(argumentArr[0]) :
                argumentArr[0];

        const betweenArgument =
            argumentArrLength > 2 ?
                argumentArr.slice(1, argumentArrLength - 1) :
                null;

        const lastArgument =
            argumentArrLength > 1 ?
                argumentArr[argumentArrLength - 1] :
                null;

        // Filter the sub flags if it is found in the command
        let subFlag = [];

        // Special case: the user chooses the sub flag (without main flag) when it generates a project
        if (argumentArrLength === 2) {
            if (supportedSubFlag.indexOf(firstArgument) > -1) {
                subFlag = [...subFlag, firstArgument];
            }
        }

        if (betweenArgument !== null && betweenArgument.length > 0) {
            betweenArgument.map((flag) => {
                if (supportedSubFlag.indexOf(flag) > -1) {
                    subFlag = [...subFlag, flag];
                }
            });
        }

        return {
            ...defaultReturn,
            firstArgument: supportedSubFlag.indexOf(firstArgument) > -1 ? null : firstArgument,
            betweenArgument: betweenArgument,
            lastArgument: lastArgument,
            subFlag: subFlag,
            argumentArrLength: argumentArrLength
        };
    }

    return defaultReturn;
}

module.exports = {
    command: { parse: commandParse },
    option: { parse: optionParse }
};
