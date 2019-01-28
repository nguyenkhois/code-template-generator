/**
 * "optionList" is a global () variable in this app.
 * View more about Nodejs global object here:
 * https://nodejs.org/api/globals.html#globals_global
 */

// Using the "global" object in Node.js
global.optionList = [];

function definition(flag) {
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

function identification(inputArg, optionArr = optionList) {
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

module.exports = {
    definition,
    identification
};
