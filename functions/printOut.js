const { supportedTemplate } = require("../common/");
const { filterByProperty } = require("../helpers/");
const { errorCodeList } = require("./errorHandling");

/**
 * Print out the information
 * @param {array} optionList
 */
function helpInformation(optionList) {
    let mainFlagContent = "";
    let aliasContent = "";
    let subFlagContent = "";

    optionList.map((option) => {
        const { flag, alias, subFlags, description } = option;

        if (flag !== "-root") {
            mainFlagContent += `\t${flag}\t${description}\n`;
            aliasContent += `\t${flag}\t${alias}\n`;
        }

        if (subFlags.length > 0) {
            if (flag !== "-root") {
                subFlagContent += `\n\t${flag}`;
            } else {
                subFlagContent += "\n\t";
            }

            subFlags.map((subFlag, index) => {
                const { flag, description } = subFlag;

                if (index !== 0) {
                    subFlagContent += `\n\t`;
                }

                subFlagContent += `\t\x1b[90m${flag}\x1b[0m`;
                if (flag.length < 8) {
                    subFlagContent += `\t`;
                }
                subFlagContent += `\t${description}`;
            });
        }
    });

    const helpContent = "USAGE:" +
        "\n\t$ generate [-option] \x1b[90m[--sub-option]\x1b[0m \x1b[33m[project-name][component-name][path]\x1b[0m" +
        "\n\nOPTIONS:" +
        `\n${mainFlagContent}` +
        "\nSUB OPTIONS:" +
        `${subFlagContent}` +
        "\n\nALIASES:" +
        `\n${aliasContent}` +
        "\nEXAMPLES:" +
        "\n\t$ generate \x1b[33mfirst-project\x1b[0m" +
        "\n\t$ generate -g \x1b[33msecondproject\x1b[0m" +
        "\n\t$ generate -g \x1b[90m--no-install\x1b[0m \x1b[33mThirdProject\x1b[0m" +
        "\n\t$ generate \x1b[90m--no-install\x1b[0m \x1b[33mOtherProject\x1b[0m" +
        "\n" +
        "\n\t$ generate -c \x1b[33mSearchComponent.js\x1b[0m" +
        "\n\t$ generate -r \x1b[33mReviewComponent.jsx\x1b[0m" +
        "\n\t$ generate -fc \x1b[33mProductComponent\x1b[0m" +
        "\n\t$ generate -fr \x1b[33mCartComponent\x1b[0m" +
        "\n" +
        "\n\t$ generate -cf \x1b[90m--set-asset\x1b[0m \x1b[33m\"C:\\Users\\name\\myassets\"\x1b[0m (Windows)" +
        "\n\t$ generate -cf \x1b[90m--set-asset\x1b[0m \x1b[33m\"/Users/name/myassets\"\x1b[0m (MacOS)" +
        "\n\t$ generate -cf \x1b[90m--set-asset\x1b[0m \x1b[33m\"/home/name/myassets\"\x1b[0m (Ubuntu)" +
        "\n\t$ generate -cf \x1b[90m--view-asset\x1b[0m" +
        "\n\t$ generate -m" +
        "\n" +
        "\n\t$ generate --gitignore" +
        "\n\t$ generate --version" +
        "\n\t$ generate --help" +
        "\n\t$ generate --update";

    return helpContent;
}

/**
 * Print out a message
 * @param {string} latestVersion
 */
function printUpdateMessage(latestVersion) {
    const message = "\n" +
        "\t---------------------------------------------------------\n" +
        `\t|   \x1b[33mThe latest stable version ${latestVersion} is available\x1b[0m.\t|\n` +
        "\t|   Run \x1b[36mnpm i -g code-template-generator\x1b[0m to install.\t|\n" +
        "\t---------------------------------------------------------\n";
    console.log(message);
}

/**
 * The resolving has many flexible properties therefore you should be careful on every case
 * @param {object} resolving is flexible
 */
function printOutResolve(resolving) {
    const { type, name, template, message } = resolving;

    switch (type) {
        case "project":
            printOutGuideAfterGeneration(name, template);
            break;

        case "component":
            const regularExpression = /component/gi;
            const seekingComponentText = regularExpression.test(name);

            console.log("\n\x1b[32mDone!\x1b[0m " +
                `${name} ` +
                `${!seekingComponentText ? type + " " : ""}` +
                "is generated successfully.\n");

            break;

        case "file":
            console.log(`\n\x1b[32mDone!\x1b[0m ${name} is generated successfully.\n`);
            break;

        case "info":
        case "update":
            console.log(message + "\n");
            break;

        case "config":
            const { subFlag, result } = message;

            switch (subFlag) {
                case "--set-asset":
                    console.log(`\n\x1b[32mDone!\x1b[0m "\x1b[36m${result}\x1b[0m" is saved successfully.\n`);
                    break;

                case "--view-asset":
                    console.log(`\nYour current asset location is \x1b[36m${result}\x1b[0m\n`);
                    break;

                default:
                    break;
            }

            break;

        case "asset":
            let results = {};

            if (message && Object.keys(message).length > 0) {
                const { passed, failure } = message;

                if (passed && failure) {
                    results = Object.assign(results, {
                        "passed": passed || [],
                        "failure": failure || [],
                        "passedQuantity": passed.length,
                        "failureQuantity": failure.length
                    });
                }
            }

            if (Object.keys(results).length > 0) {
                const { passed, failure, passedQuantity, failureQuantity } = results;

                console.log(`\n\x1b[32mDone!\x1b[0m You have successfully retrieved your asset(s).` +
                    `\n\n\x1b[36mPassed:\x1b[0m ${passedQuantity} ${passedQuantity > 0 ?
                        `(${passed})` : ''}` +

                    `${failureQuantity > 0 ?
                        `\n\n\x1b[31mFailure:\x1b[0m ${failureQuantity} (${failure})` +
                        "\nIt may be already exist in the current work directory." :
                        ''}\n`);
            }

            break;

        default:
            break;
    }
}

/**
 * Print out an error message
 * @param {object} error
 */
function printOutReject(error) {
    const generalErrorMessage = "\n\x1b[31mError!\x1b[0m Error is found and process is interrupted.\n";
    const { code } = error;

    if (code) {
        filterByProperty(errorCodeList, "code", code)
            .then((result) => {
                if (Array.isArray(result) && result.length === 1) {
                    console.log(`\n\x1b[31mError!\x1b[0m ${result[0].error}.`);
                    console.log(`${result[0].solution}.\n`);
                } else {
                    console.log(generalErrorMessage);
                }
            })
            .catch((err) => {
                console.log(`${generalErrorMessage}\n${err.message ? err.message : ''}`);
            });
    } else {
        console.log(generalErrorMessage);
    }
}

/**
 * Print out information after the installation
 * @param {string} projectName
 * @param {string} templateName
 */
function printOutGuideAfterGeneration(projectName, templateName) {
    const beginMessage = "\n\x1b[32mSUCCESS! \x1b[0m" +
        `Your project ${projectName} is generated by the template ${templateName}.` +
        `\n\n\t\x1b[36mcd ${projectName}\x1b[0m\n\t   Changes into the project directory`;

    let detailMessage = "\n";

    const endMessage = "\n\nYou can view README.md for more information." +
        "\n\nHappy coding! (^_^)\n";

    filterByProperty(supportedTemplate, "name", templateName)
        .then((result) => {
            if (result.length === 1) {
                switch (result[0].type) {
                    case "react": // React project
                        detailMessage += "\n\t\x1b[36mnpm start\x1b[0m\n\t   Starts the development server at http://localhost:9000" +
                            "\n\n\t\x1b[36mnpm run build\x1b[0m\n\t   Bundles the app for production";
                        break;

                    case "express": // Express project
                        detailMessage += "\n\t\x1b[36mnpm start\x1b[0m\n\t   Starts the local web server at http://localhost:8000";
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
