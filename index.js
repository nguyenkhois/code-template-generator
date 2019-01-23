#!/usr/bin/env node

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
} = require('./functions/');

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
                                .then(() => resolve(true))
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
                            resolve({ type: "info" });
                        })
                        .catch((err) => {
                            reject({ code: err.message });
                        });

                    break;

                default:
                    validateInputName(firstArgument)
                        .then(() => {
                            generateTemplate(firstArgument)
                                .then(() => resolve(true))
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
                .then(() => resolve(true))
                .catch((err) => reject({ code: err.message }));
        }
    });
}

// MAIN APP
/**
 * Reject a custom object = {
 *      code: err.message
 * }
 */
MainApp()
    .then((result) => {
        if (result.type !== undefined && result.type !== "info") {
            printOutResolve(result);
        }

        autoUpdateCheck().then((availability) => {
            if (availability.isFound) {
                printUpdateMessage(availability.version);
            }
        }).catch((err) => {
            // Internet connection is not found
            if (/ENOTFOUND/g.test(err.message)) {
                printOutReject({ code: 'i002' });
            }
        });
    })
    .catch((error) => {
        printOutReject(error);
    });
