#!/usr/bin/env node

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorIdentification
} = require("./functions/");

function MainApp() {
    return new Promise((resolve, reject) => {
        const inputArgument = process.argv.slice(2, process.argv.length) || [];

        if (inputArgument.length > 0) {
            const firstArgument = inputArgument[0];
            const secondArgument = inputArgument.length > 1 ? inputArgument[1] : null;

            switch (firstArgument) {
                case "-g":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateTemplate(secondArgument, { gitSupport: true }) // It must be (projectName, option)
                                .then(() => resolve({ type: "template"}))
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
                                .then((fullFileName) => resolve({ type: "component", content: fullFileName }))
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
                                .then((fullDirName) => resolve({ type: "component", content: fullDirName }))
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
                        .then((fileName) => resolve({ type: "file", content: fileName }))
                        .catch((err) => reject({ code: err.message }));

                    break;

                case "-v":
                    // Get installed version
                    installedVersion()
                        .then((version) => {
                            console.log(version);
                            resolve({ type: "info" });
                        })
                        .catch((err) => reject({ code: err.message }));

                    break;

                case "-help":
                    // Show the help information
                    console.log(helpInformation());
                    resolve({ type: "info" });

                    break;

                case "-u":
                    checkAndInstallStableUpdate()
                        .then(() => {
                            resolve({ type: "updating" });
                        })
                        .catch((err) => {
                            reject({ code: err.message });
                        });

                    break;

                default:
                    validateInputName(firstArgument)
                        .then(() => {
                            generateTemplate(firstArgument)
                                .then(() => resolve({ type: "template"}))
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
                .then(() => resolve({ type: "template"}))
                .catch((err) => reject({ code: err.message }));
        }
    });
}

// MAIN APP
/**
 * Resolving types: template, component, file, info, updating
 * Reject a custom object = {
 *      code: err.message // Create custom error code
 * }
 */
MainApp()
    .then((resolving) => {
        const printOutResolvingTypes = ["component", "file"];

        if (printOutResolvingTypes.indexOf(resolving.type) > -1) {
            printOutResolve(resolving);
        }

        // Automatic update checking after resolving
        if (resolving.type !== "updating") {
            autoUpdateCheck().then((version) => {
                if (version.isUpdateFound) {
                    printUpdateMessage(version.latest);
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
