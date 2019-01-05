const supportFunctions = require('./functions');
const templateFunctions = require('./template');

const regularExpression = /^(?![\-\.])([A-Za-z\-\_\.\d])+([A-Za-z\d])+$/;

const errorMessage = {
    errorText: "\x1b[31mError!\x1b[0m",
    forGeneral: `\x1b[31mError!\x1b[0m Error is found and the process is interrupted.`,
    forProjectName: '\x1b[31mError!\x1b[0m The project name is invalid.\nProject name may only include letters, numbers, underscores and hashes.',
    componentName: "The component name is invalid.",
    componentFileExtension: "The supported file extensions are *.js and *.jsx.",
    componentCommand: "\nYou may want to use the command \x1b[33mgenerate -c <component-name.js>\x1b[0m.\n"
};

module.exports = {
    ...supportFunctions,
    ...templateFunctions,
    regularExpression,
    errorMessage
}