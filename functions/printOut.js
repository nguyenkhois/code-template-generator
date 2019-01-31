const { filterByProperty, supportedTemplate } = require("../common/");
const { errorCode } = require("./errorHandling");

// Print out the information
function helpInformation() {
    let mainFlagContent = "";
    let aliasContent = "";
    let subFlagContent = "";

    optionList.map((option) => {
        if (option.flag !== "-root") {
            mainFlagContent += `\t${option.flag}\t${option.description}\n`;
            aliasContent += `\t${option.flag}\t${option.alias}\n`;

            if (option.subFlag.length > 0) {
                subFlagContent += `\n\t${option.flag}`;
                option.subFlag.map((subFlag, index) => {
                    if (index !== 0) {
                        subFlagContent += `\n\t`;
                    }

                    subFlagContent += `\t\x1b[90m${subFlag.flag}\x1b[0m   ${subFlag.description}`;
                });
            }
        }
    });

    const helpContent = "USAGE:" +
        "\n\t$ generate [option] \x1b[33m<project-name>[<component-name>]\x1b[0m" +
        "\n\nOPTIONS:" +
        `\n${mainFlagContent}` +
        "\nSUB OPTIONS:" +
        `${subFlagContent}` +
        /* "\n\t-g" +
        "\n\t\t--no-install \tNo install dependencies when a project is generated" + */
        "\n\nALIASES:" +
        `\n${aliasContent}` +
        "\nEXAMPLES:" +
        "\n\t$ generate \x1b[33mfirst-project\x1b[0m" +
        "\n\t$ generate -g \x1b[33msecondproject\x1b[0m" +
        "\n\t$ generate --git \x1b[33mThirdProject\x1b[0m" +
        "\n\t$ generate -g \x1b[90m--no-install\x1b[0m \x1b[33mOtherProject\x1b[0m" +
        "\n\t$ generate \x1b[90m--no-install\x1b[0m \x1b[33mLastProject\x1b[0m" +
        "\n" +
        "\n\t$ generate -c \x1b[33mSearchComponent.js\x1b[0m" +
        "\n\t$ generate -r \x1b[33mReviewComponent.jsx\x1b[0m" +
        "\n\t$ generate -fc \x1b[33mProductComponent\x1b[0m" +
        "\n\t$ generate -fr \x1b[33mCartComponent\x1b[0m" +
        "\n" +
        "\n\t$ generate --gitignore" +
        "\n\t$ generate -v" +
        "\n\t$ generate -help" +
        "\n\t$ generate --update";

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
            console.log(resolving.message + "\n");
            break;

        default:
            break;
    }
}

/**
 * Custom error object structure
 * @param {*} error = {
 *      "code": "err.message"
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
    const beginMessage = "\n\x1b[32mSUCCESS! \x1b[0m" +
        `Your project ${projectName} is generated successfully by the template ${templateName}.` +
        `\n\n\t\x1b[36mcd ${projectName}\x1b[0m\tto change into your project directory`;

    let detailMessage = "\n";

    const endMessage = "\n\nView README.md for more information." +
        "\n\nHappy coding! (^_^)\n";

    filterByProperty(supportedTemplate, "name", templateName)
        .then((result) => {
            if (result.length === 1) {
                switch (result[0].type) {
                    case "react": // React project
                        detailMessage += "\n\t\x1b[36mnpm start\x1b[0m\tto start the local web server at http://localhost:9000" +
                            "\n\t\x1b[36mnpm run build\x1b[0m\tto compile your code";
                        break;

                    case "express": // Express project
                        detailMessage += "\n\t\x1b[36mnpm start\x1b[0m\tto start the local web server at http://localhost:8000";
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
