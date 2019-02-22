#!/usr/bin/env node

const { Command } = require("command-handling");

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorIdentification, AppError, configHandling, retrieveAsset
} = require("./functions/");

// Definitions for main options and sub options
const command = new Command();
command
    .option("-root", "", "Root of a command") // Special case
    .option("-g", "--git", "Run git init and generate a .gitignore file")
    .option("-c", "--component", "Generate a React component file (*.js, *.jsx)")
    .option("-r", "--redux-component", "Generate a React-Redux component file (*.js, *.jsx)")
    .option("-fc", "--full-component", "Generate a full React component (*.css, *.js)")
    .option("-fr", "--full-redux-component", "Generate a full React-Redux component (*.css, *.js)")
    .option("-i", "--gitignore", "Generate a .gitignore file")
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View help documentation")
    .option("-u", "--update", "Install the latest stable version")
    .option("-cf", "--config", "Config for this application")
    .option("-m", "--my-asset", "Retrieve assets from a specific directory")
    .subOption("-root", "--no-install", "No run git init and no install dependencies")
    .subOption("-g", "--no-install", "No install dependencies")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");
// End of definitions

function MainApp() {
    return new Promise((resolve, reject) => {
        const { mainFlag, subFlags, argument, commandLength, unknowns } = command.parse(process.argv);

        if (commandLength > 0 && unknowns.length === 0){
            let projectOption = {
                "gitSupport": false,
                "subFlags": subFlags
            };

            switch (mainFlag) {
                case "-g":
                    validateInputName(argument)
                        .then(() => {
                            projectOption = Object.assign(projectOption, { "gitSupport": true });

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
                                reject(new AppError("p001"));
                            } else if (err.code === "n002") {
                                reject(new AppError("p002"));
                            }
                        });

                    break;

                // Using for both React component and React-Redux component
                case "-c":
                case "-r":
                    validateInputName(argument)
                        .then(() => {
                            const componentOption = { componentType: mainFlag };

                            generateComponent(argument, componentOption)
                                .then((fullFileName) => resolve({ type: "component", name: fullFileName }))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            if (err.code === "n001") {
                                reject(new AppError("c001"));
                            } else if (err.code === "n002") {
                                reject(new AppError("c002"));
                            }
                        });

                    break;

                case "-fc":
                case "-fr":
                    validateInputName(argument)
                        .then(() => {
                            const componentOption = { componentType: mainFlag };

                            generateFullComponent(argument, componentOption)
                                .then((fullDirName) => resolve({ type: "component", name: fullDirName }))
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            if (err.code === "n001") {
                                reject(new AppError("fu001"));
                            } else if (err.code === "n002") {
                                reject(new AppError("fu002"));
                            }
                        });

                    break;

                case "-i":
                    generateGitignoreFile()
                        .then((fileName) => resolve({ type: "file", name: fileName }))
                        .catch((err) => reject(err));

                    break;

                case "-v":
                    // Show the installed version
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
                    const configOption = { "subFlags": subFlags };

                    configHandling(argument, configOption)
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
                                reject(new AppError("p001")); // Error code mapping
                            } else if (err.code === "n002") {
                                reject(new AppError("p002"));
                            }
                        });

                    break;
            }
        } else if (commandLength === 0) {
            generateTemplate()
                .then((result) => resolve({
                    type: "project",
                    name: result.name,
                    template: result.template
                }))
                .catch((err) => reject(err));
        } else {
            reject(new AppError("i003")); // Unknown command
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
 * reject = error object
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
