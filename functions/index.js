const supportFunctions = require("./functions");
const templateFunctions = require("./template");

module.exports = {
    ...supportFunctions,
    ...templateFunctions
};
