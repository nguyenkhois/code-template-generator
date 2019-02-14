#!/usr/bin/env node

const { Command } = require("command-handling");

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorIdentification, configHandling, retrieveAsset
} = require("./functions/");

// Option and sub option definitions
const command = new Command();
command
    .option("-root", "", "Root for the command") // Special case
    .option("-g", "--git", "Run git init and generate a .gitignore file")
    .option("-c", "--component", "Generate a React component file (*.js, *.jsx)")
    .option("-r", "--redux-component", "Generate a React-Redux component file (*.js, *.jsx)")
    .option("-fc", "--full-component", "Generate a full React component (*.css, *.js)")
    .option("-fr", "--full-redux-component", "Generate a full React-Redux component (*.css, *.js)")
    .option("-i", "--gitignore", "Generate a .gitignore file")
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View the help information")
    .option("-u", "--update", "Install the latest stable version")
    .option("-cf", "--config", "Config for this app")
    .option("-m", "--my-asset", "Retrieve assets from a specific directory")
    .subOption("-root", "--no-install", "No run git init and no install dependencies")
    .subOption("-g", "--no-install", "No install dependencies")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");
// End of definitions

function MainApp() {
    return new Promise((resolve, reject) => {
        const { mainFlag, subFlags, argument, commandLength } = command.parse(process.argv);

        if (commandLength > 0) {
            // Default
            let projectOption = {
                "gitSupport": false,
                "subFlags": subFlags
            };

            switch (mainFlag) {
                case "-g":
                    validateInputName(argument)
                        .then(() => {
                            projectOption = {
                                ...projectOption,
                                "gitSupport": true,
                                "subFlags": subFlags
                            };

                            generateTemplate(argument, projectOption) // It must be (projectName, option)
                                .then((result) => resolve({
                                    type: "project",
                                    name: result.name,
                                    template: result.template
                                }))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            if (err.code === "n001") {
                                reject({ code: "p001" }); // The project name is invalid
                            } else if (err.code === "n002") {
                                reject({ code: "p002" }); // The project name is empty
                            }
                        });

                    break;

                // Both React component and React-Redux component
                case "-c":
                case "-r":
                    validateInputName(argument)
                        .then(() => {
                            generateComponent(argument, { componentType: mainFlag })
                                .then((fullFileName) => resolve({ type: "component", name: fullFileName }))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            if (err.code === "n001") {
                                reject({ code: "c001" });
                            } else if (err.code === "n002") {
                                reject({ code: "c002" });
                            }
                        });

                    break;

                case "-fc":
                case "-fr":
                    validateInputName(argument)
                        .then(() => {
                            generateFullComponent(argument, { componentType: mainFlag })
                                .then((fullDirName) => resolve({ type: "component", name: fullDirName }))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            if (err.code === "n001") {
                                reject({ code: "fu001" });
                            } else if (err.code === "n002") {
                                reject({ code: "fu002" });
                            }
                        });

                    break;

                case "-i":
                    generateGitignoreFile()
                        .then((fileName) => resolve({ type: "file", name: fileName }))
                        .catch((err) => reject(err));

                    break;

                case "-v":
                    // Get installed version
                    installedVersion()
                        .then((version) => {
                            resolve({ type: "info", message: version });
                        })
                        .catch((err) => reject(err));

                    break;

                case "-help":
                    const optionList = command.showOptions();
                    resolve({ type: "info", message: helpInformation(optionList) });

                    break;

                case "-u":
                    checkAndInstallStableUpdate()
                        .then((result) => {
                            resolve({ type: "update", message: result.message });
                        })
                        .catch((err) => reject(err));

                    break;

                case "-cf":
                    const option = {
                        "subFlags": subFlags
                    };

                    configHandling(argument, option)
                        .then((result) => {
                            resolve({ type: "config", message: result });
                        })
                        .catch((err) => reject(err));

                    break;

                case "-m":
                    retrieveAsset()
                        .then((result) => {
                            resolve({ type: "asset", message: result });
                        })
                        .catch((err) => reject(err));

                    break;

                default:
                    validateInputName(argument)
                        .then(() => {
                            generateTemplate(argument, projectOption)
                                .then((result) => resolve({
                                    type: "project",
                                    name: result.name,
                                    template: result.template
                                }))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            if (err.code === "n001") {
                                reject({ code: "p001" }); // Error code mapping
                            } else if (err.code === "n002") {
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
                .catch((err) => reject(err));
        }
    });
}

// MAIN APP
/**
 * resolving = result = {
 *      "type": "[project][component][file][info][update]"
 *      ...
 * };
 *
 * reject = error = {
 *      code: "err.message"
 * };
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
                const customErrorObject = errorIdentification(err);
                printOutReject(customErrorObject);
            });
        }
    })
    .catch((error) => {
        printOutReject(error);
    });
