#!/usr/bin/env node

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorIdentification
} = require("./functions/");

// Option definition - (<flag>)([alias])([description])
const option = require("./functions/optionHandling");

option.definition("-g")("--git")();
option.definition("-c")("--component")("Generate a React component");
option.definition("-fc")("--full-component")("Generate a full React component");
option.definition("-r")("--redux-component")("Generate a React-Redux component");
option.definition("-fr")("--full-redux-component")("Generate a full React-Redux component");
option.definition("-i")("--gitignore")("Generate a .gitignore file");
option.definition("-v")("--version")("View the installed version");
option.definition("-help")()("View the help information");
option.definition("-u")("--update")("Checking and updating for the latest stable version");
// End of definition

function MainApp() {
    return new Promise((resolve, reject) => {
        const inputArgument = process.argv.slice(2, process.argv.length) || [];

        if (inputArgument.length > 0) {
            const firstArgument =
                option.identification(inputArgument[0]) !== -1 ?
                    option.identification(inputArgument[0]) :
                    inputArgument[0];

            const secondArgument = inputArgument.length > 1 ? inputArgument[1] : null;

            switch (firstArgument) {
                case "-g":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateTemplate(secondArgument, { gitSupport: true }) // It must be (projectName, option)
                                .then((result) => resolve({
                                    type: "project",
                                    name: result.name,
                                    template: result.template
                                }))
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001") {
                                reject({ code: "p001" }); // The project name is invalid
                            } else if (err.message === "n002") {
                                reject({ code: "p002" }); // The project name is empty
                            }
                        });

                    break;

                // Both React component and React-Redux component
                case "-c":
                case "-r":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateComponent(secondArgument, { componentType: firstArgument })
                                .then((fullFileName) => resolve({ type: "component", name: fullFileName }))
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001") {
                                reject({ code: "c001" });
                            } else if (err.message === "n002") {
                                reject({ code: "c002" });
                            }
                        });

                    break;

                case "-fc":
                case "-fr":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateFullComponent(secondArgument, { componentType: firstArgument })
                                .then((fullDirName) => resolve({ type: "component", name: fullDirName }))
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001") {
                                reject({ code: "fu001" });
                            } else if (err.message === "n002") {
                                reject({ code: "fu002" });
                            }
                        });

                    break;

                case "-i":
                    generateGitignoreFile()
                        .then((fileName) => resolve({ type: "file", name: fileName }))
                        .catch((err) => reject({ code: err.message }));

                    break;

                case "-v":
                    // Get installed version
                    installedVersion()
                        .then((version) => {
                            resolve({ type: "info", message: version });
                        })
                        .catch((err) => reject({ code: err.message }));

                    break;

                case "-help":
                    // Show the help information
                    resolve({ type: "info", message: helpInformation() });

                    break;

                case "-u":
                    checkAndInstallStableUpdate()
                        .then((result) => {
                            resolve({ type: "update", message: result.message });
                        })
                        .catch((err) => {
                            reject({ code: err.message });
                        });

                    break;

                default:
                    validateInputName(firstArgument)
                        .then(() => {
                            generateTemplate(firstArgument)
                                .then((result) => resolve({
                                    type: "project",
                                    name: result.name,
                                    template: result.template
                                }))
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001") {
                                reject({ code: "p001" }); // Error code mapping
                            } else if (err.message === "n002") {
                                reject({ code: "p002" });
                            }
                        });

                    break;
            }
        } else {
            generateTemplate()
                .then((result) => resolve({
                    type: "project",
                    name: result.name,
                    template: result.template
                }))
                .catch((err) => reject({ code: err.message }));
        }
    });
}

// MAIN APP
/**
 * Resolving types: project, component, file, info, update
 * Reject is using a custom error object = {
 *      code: err.message
 * }
 */
MainApp()
    .then((resolving) => {
        printOutResolve(resolving);

        // Automatic update checking after resolving
        if (resolving.type !== "update") {
            autoUpdateCheck().then((versionInfo) => {
                if (versionInfo.isUpdateFound) {
                    printUpdateMessage(versionInfo.latest);
                }
            }).catch((err) => {
                const customErrorCode = errorIdentification(err).message;
                printOutReject({ code: customErrorCode });
            });
        }
    })
    .catch((error) => {
        printOutReject(error);
    });
