const supportFunctions = require("./utils");
const templateFunctions = require("./templateGeneration");
const printOutFunctions = require("./printOut");
const { errorIdentification, AppError } = require("./errorHandling");
const configFunctions = require("./configHandling");

module.exports = {
    ...supportFunctions,
    ...templateFunctions,
    ...printOutFunctions,
    errorIdentification,
    AppError,
    ...configFunctions
};
