const supportFunctions = require('./functions');
const templateFunctions = require('./template');

const regularExpression = /^(?![\-\.])([A-Za-z\-\_\.\d])+([A-Za-z\d])+$/;

module.exports = {
    ...supportFunctions,
    ...templateFunctions,
    regularExpression
}