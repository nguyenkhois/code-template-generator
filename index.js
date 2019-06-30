#!/usr/bin/env node

// Option definitions
const { command } = require("./common/commandDefinition");

const { installedVersion, autoUpdateCheck, checkAndInstallStableUpdate, validateInputName,
    helpInformation, printUpdateMessage, printOutResolve, printOutReject,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    AppError, errorIdentification, errorMapping, configHandling, retrieveAsset
} = require("./features/");

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
                            const mapping = [
                                ["n001", "p001"],
                                ["n002", "p002"]
                            ];

                            reject(errorMapping(err, mapping));
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
                            const mapping = [
                                ["n001", "c001"],
                                ["n002", "c002"]
                            ];

                            reject(errorMapping(err, mapping));
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
                            const mapping = [
                                ["n001", "fu001"],
                                ["n002", "fu002"]
                            ];

                            reject(errorMapping(err, mapping));
                        });

                    break;

                case "-i":
                    generateGitignoreFile()
                        .then((fileName) => resolve({ type: "file", name: fileName }))
                        .catch((err) => reject(err));

                    break;

                case "-v":
                    installedVersion()
                        .then((version) => resolve({ type: "info", message: version }))
                        .catch((err) => reject(err));

                    break;

                case "-help":
                    const optionList = command.showOptions();
                    resolve({ type: "info", message: helpInformation(optionList) });

                    break;

                case "-u":
                    checkAndInstallStableUpdate()
                        .then((result) => resolve({ type: "update", message: result.message }))
                        .catch((err) => reject(err));

                    break;

                case "-cf":
                    const configOption = { "subFlags": subFlags };

                    configHandling(argument, configOption)
                        .then((result) => resolve({ type: "config", message: result }))
                        .catch((err) => reject(err));

                    break;

                // User asset generation
                case "-m":
                    retrieveAsset()
                        .then((result) => resolve({ type: "asset", message: result }))
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
                            const mapping = [
                                ["n001", "p001"],
                                ["n002", "p002"]
                            ];

                            reject(errorMapping(err, mapping));
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

/**
 * MAIN APP
 * The resolving is a flexible object that is the result.
 * resolving: {
 *      "type": string // [project][component][file][info][update]
 *      "name": string
 *      "message": string
 *      "template": string
 * };
 *
 * The reject is an error object
 */
MainApp()
    .then((resolving) => {
        printOutResolve(resolving);

        // Automatic update checking after resolving
        const { type } = resolving;
        if (type && type !== "update") {
            autoUpdateCheck().then((versionInfo) => {
                const { isUpdateFound, latest } = versionInfo;
                if (isUpdateFound && latest) {
                    printUpdateMessage(latest);
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
