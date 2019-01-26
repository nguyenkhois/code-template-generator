const { filterByProperty, supportedTemplate } = require("../common/");
const { errorCode } = require("./errorHandling");

// Print out the information
function helpInformation() {
    const helpContent = "\nCOMMAND:" +
        "\n\t$ generate [option] \x1b[33m<name>\x1b[0m" +
        "\n\nREQUIRED:" +
        "\n\t\x1b[33m<name>\x1b[0m\t\tIt is <project-name> or <component-name>" +
        "\n\nOPTION:" +
        "\n\t-g\t\tInstall automatically Git support and generate a .gitignore file" +
        "\n\t-c\t\tGenerate a React component file (*.js, *.jsx)" +
        "\n\t-r\t\tGenerate a React-Redux component file (*.js, *.jsx)" +
        "\n\t-fc\t\tGenerate a full React component (a directory with *.js, *.css)" +
        "\n\t-fr\t\tGenerate a full React-Redux component (a directory with *.js, *.css)" +
        "\n\t-i\t\tGenerate a .gitignore file" +
        "\n\t-v\t\tView the installed version" +
        "\n\t-help\t\tDisplay the help information" +
        "\n\nEXAMPLE:" +
        "\n\t$ generate \x1b[33mfirst-project\x1b[0m" +
        "\n\t$ generate -g \x1b[33msecond-project\x1b[0m" +
        "\n\t$ generate -c \x1b[33mSearchComponent.js\x1b[0m" +
        "\n\t$ generate -r \x1b[33mReviewComponent.jsx\x1b[0m" +
        "\n\t$ generate -fc \x1b[33mProductComponent\x1b[0m" +
        "\n\t$ generate -fr \x1b[33mCartComponent\x1b[0m" +
        "\n\t$ generate -i" +
        "\n\t$ generate -v" +
        "\n\t$ generate -help" +
        "\n\t$ generate -u";

    return helpContent;
}

function printUpdateMessage(latestVersion) {
    const message = "\n" +
        "\t---------------------------------------------------\n" +
        `\t| \x1b[33mThe latest stable version ${latestVersion} is available\x1b[0m.   |\n` +
        "\t| Run \x1b[36mnpm i -g code-template-generator\x1b[0m to update. |\n" +
        "\t---------------------------------------------------\n";
    console.log(message);
}

function printOutResolve(resolving) {
    switch (resolving.type) {
        case "project":
            printOutGuideAfterGeneration(resolving.name, resolving.template);
            break;

        case "component":
            const regularExpression = /component/gi;
            const seekingComponentText = regularExpression.test(resolving.name);

            console.log("\n\x1b[32mDone!\x1b[0m " +
                `${resolving.name} ` +
                `${!seekingComponentText ? resolving.type + " " : ""}` +
                "is generated successfully.\n");

            break;

        case "file":
            console.log(`\n\x1b[32mDone!\x1b[0m ${resolving.name} is generated successfully.\n`);
            break;

        case "info":
        case "update":
            console.log(resolving.message);
            break;

        default:
            break;
    }
}

/**
 * Structure
 * @param {*} error = {
 *      code: err.message
 * }
 */
function printOutReject(error) {
    filterByProperty(errorCode, "code", error.code)
        .then((result) => {
            if (result.length === 1) {
                console.log(`\n\x1b[31mError!\x1b[0m ${result[0].error}.`);
                console.log(`${result[0].solution}.\n`);
            } else {
                // For general error
                console.log("\n\x1b[31mError!\x1b[0m Error is found and the process is interrupted.\n");
            }
        })
        .catch((err) => console.log(err.message));
}

function printOutGuideAfterGeneration(projectName, templateName) {
    const beginMessage = "\x1b[32mSUCCESS! \x1b[0m" +
        `Your project ${projectName} is generated successfully by the template ${templateName}.` +
        `\n\n\t\x1b[36mcd ${projectName}\x1b[0m to change into your project directory`;

    let detailMessage = "\n";

    const endMessage = "\n\nView README.md for more information." +
        "\n\nHappy coding! (^_^)";

    filterByProperty(supportedTemplate, "name", templateName)
        .then((result) => {
            if (result.length === 1) {
                switch (result[0].type) {
                    case "react": // React project
                        detailMessage += "\n\t\x1b[36mnpm start \x1b[0m to start the local web server at http://localhost:9000" +
                            "\n\t\x1b[36mnpm run build \x1b[0m to compile your code";
                        break;

                    case "express": // Express project
                        detailMessage += "\n\t\x1b[36mnpm start \x1b[0m to start the local web server at http://localhost:8000";
                        break;

                    default:
                        break;
                }
            }

            console.log(beginMessage + detailMessage + endMessage);
        })
        .catch((err) => console.log(err.message));
}

module.exports = {
    helpInformation,
    printUpdateMessage,
    printOutResolve,
    printOutReject,
    printOutGuideAfterGeneration,
};
