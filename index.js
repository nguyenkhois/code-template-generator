#!/usr/bin/env node

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorIdentification
} = require("./functions/");

const { command, option, subflag } = require("./functions/commandHandling");

option.parse();

function MainApp() {
    return new Promise((resolve, reject) => {
        const inputCommand = command.parse(process.argv);

        if (inputCommand.commandLength > 0) {
            const firstArgument = inputCommand.firstArgument;
            const lastArgument = inputCommand.lastArgument;
            const subFlagArr = inputCommand.subFlag;

            // Default
            let projectOption = {
                "gitSupport": false,
                "subFlag": subFlagArr
            };

            switch (firstArgument) {
                case "-g":
                    validateInputName(lastArgument)
                        .then(() => {
                            projectOption = {
                                ...projectOption,
                                "gitSupport": true,
                                "subFlag": subflag.filterByMainFlag("-g")(subFlagArr)
                            };

                            generateTemplate(lastArgument, projectOption) // It must be (projectName, option)
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
                    validateInputName(lastArgument)
                        .then(() => {
                            generateComponent(lastArgument, { componentType: firstArgument })
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
                    validateInputName(lastArgument)
                        .then(() => {
                            generateFullComponent(lastArgument, { componentType: firstArgument })
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
                    resolve({ type: "info", message: helpInformation() });

                    break;

                case "-u":
                    checkAndInstallStableUpdate()
                        .then((result) => {
                            resolve({ type: "update", message: result.message });
                        })
                        .catch((err) => reject(err));

                    break;

                default:
                    let projectName = "";

                    if (inputCommand.commandLength === 1) {
                        projectName = firstArgument;
                    } else {
                        projectName = lastArgument;
                    }

                    validateInputName(projectName)
                        .then(() => {
                            generateTemplate(projectName, projectOption)
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
