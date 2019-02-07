const supportFunctions = require("./functions");
const templateFunctions = require("./template");
const printOutFunctions = require("./printOut");
const { errorIdentification } = require("./errorHandling");
const configFunctions = require("./configHandling");

module.exports = {
    ...supportFunctions,
    ...templateFunctions,
    ...printOutFunctions,
    errorIdentification,
    ...configFunctions
};
