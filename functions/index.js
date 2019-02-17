const supportFunctions = require("./functions");
const templateFunctions = require("./template");
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
