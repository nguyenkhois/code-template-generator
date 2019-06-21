const utilsFunctions = require("./utils");
const templateFunctions = require("./templateGeneration");
const printOutFunctions = require("./printOut");
const { errorIdentification, AppError } = require("./errorHandling");
const configFunctions = require("./configHandling");

module.exports = {
    ...utilsFunctions,
    ...templateFunctions,
    ...printOutFunctions,
    errorIdentification,
    AppError,
    ...configFunctions
};
