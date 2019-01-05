#!/usr/bin/env node

const { installedVersion, autoUpdateCheck, printUpdateMessage, helpInformation, validateInputName,
    generateTemplate, generateGitignoreFile, generateComponent, generateFullComponent,
    errorMessage
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
                            generateTemplate(secondArgument, firstArgument) // It must be (projectName, option)
                                .then(() => resolve(true)) // Create a signal to complete the current and go to next job
                                .catch(() => console.log(errorMessage.forGeneral));
                        })
                        .catch(() => {
                            console.log(errorMessage.forProjectName)
                            console.log(`\nYou may want to use the command \x1b[33mgenerate -g <project-name>\x1b[0m.\n`)
                        });

                    break;

                case "-i":
                    generateGitignoreFile()
                        .then(() => {
                            console.log(`\n\x1b[32mDone!\x1b[0m A .gitignore file is generated successfully.`)
                            resolve(true);
                        })
                        .catch((err) => console.log(errorMessage.errorText, err.message));

                    break;

                // Both React component and React-Redux component
                case "-c":
                case "-r":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateComponent(secondArgument, firstArgument)
                                .then((fullFileName) => {
                                    console.log(`\n\x1b[32mDone!\x1b[0m ${fullFileName} component is generated successfully.`)
                                    resolve(true);
                                })
                                .catch((err) =>
                                    console.log(errorMessage.errorText,
                                        err.message,
                                        errorMessage.componentFileExtension,
                                        errorMessage.componentCommand)
                                );
                        })
                        .catch(() =>
                            console.log(errorMessage.errorText,
                                errorMessage.componentName,
                                errorMessage.componentFileExtension,
                                errorMessage.componentCommand)
                        );

                    break;
                
                case "-fc":
                case "-fr":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateFullComponent(secondArgument, firstArgument)
                                .then((fullDirName) => {
                                    console.log(`\n\x1b[32mDone!\x1b[0m ${fullDirName} component is generated successfully.`)
                                    resolve(true);
                                })
                                .catch((err) =>
                                    console.log(errorMessage.errorText,
                                        err.message)
                                );
                        })
                        .catch(() =>
                            console.log(errorMessage.errorText,
                                errorMessage.componentName)
                        );
                    break;

                case "-v":
                    // Get installed version
                    installedVersion()
                        .then((version) => {
                            console.log(version);
                            resolve(true);
                        })
                        .catch(() => console.log(errorMessage.forGeneral));

                    break;

                case "-help":
                    // Show the help information
                    console.log(helpInformation());
                    resolve(true);

                    break;

                default:
                    validateInputName(firstArgument)
                        .then(() => {
                            generateTemplate(firstArgument)
                                .then(() => resolve(true))
                                .catch(() => console.log(errorMessage.forProjectName));
                        })
                        .catch(() => {
                            console.log(errorMessage.forProjectName)
                            console.log(`\nYou may want to use the command \x1b[33mgenerate <project-name>\x1b[0m.\n`)
                        });

                    break;
            }
        } else {
            generateTemplate()
                .then(() => resolve(true))
                .catch(() => console.log(errorMessage.forProjectName));
        }
    });
}

// MAIN APP
MainApp()
    .then(() => {
        autoUpdateCheck().then((result) => {
            result[0] !== result[1] ?
                printUpdateMessage(result[1]) :
                null;
        })
    })
    .catch((error) => console.log(error.message));
