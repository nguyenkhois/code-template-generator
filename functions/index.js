const supportFunctions = require("./functions");
const templateFunctions = require("./template");
const printOutFunctions = require("./printOut");
const { errorIdentification } = require("./errorHandling");

module.exports = {
    ...supportFunctions,
    ...templateFunctions,
    ...printOutFunctions,
    errorIdentification
};
