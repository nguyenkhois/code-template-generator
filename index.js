#!/usr/bin/env node

// Option definitions
const { command } = require("./common/commandDefinition");

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorIdentification, AppError, configHandling, retrieveAsset
} = require("./functions/");

function MainApp() {
    return new Promise((resolve, reject) => {
        const { mainFlag, subFlags, argument, commandLength, unknowns } = command.parse(process.argv);

        if (commandLength > 0 && unknowns.length === 0) {
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

                // Single component generation
                case "-c":
                case "-r":
                case "-h":
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

                // Full component generation
                case "-fc":
                case "-fr":
                case "-fh":
                    validateInputName(argument)
                        .then(() => {
                            const componentOption = {
                                componentType: mainFlag,
                                subFlags: subFlags
                            };

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

                // User asset generation
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
