#!/usr/bin/env node

const { installedVersion, autoUpdateCheck, validateInputName, helpInformation, 
        printUpdateMessage, printOutResolve, printOutReject,
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
                            generateTemplate(secondArgument, firstArgument) // It must be (projectName, option)
                                .then(() => resolve())
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001"){
                                reject({ code: "p001" }); // The project name is invalid
                            } else if(err.message === "n002") {
                                reject({ code: "p002" }); // The project name is empty
                            }
                        });

                    break;

                // Both React component and React-Redux component
                case "-c":
                case "-r":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateComponent(secondArgument, firstArgument)
                                .then((fullFileName) => resolve({type: "component", content: fullFileName}))
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001"){
                                reject({ code: "c001" });
                            } else if(err.message === "n002") {
                                reject({ code: "c002" });
                            }
                        });

                    break;
                
                case "-fc":
                case "-fr":
                    validateInputName(secondArgument)
                        .then(() => {
                            generateFullComponent(secondArgument, firstArgument)
                                .then((fullDirName) => resolve({type: "component", name: secondArgument, content: fullDirName}))
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001"){
                                reject({ code: "c001" });
                            } else if(err.message === "n002") {
                                reject({ code: "c002" });
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

                default:
                    validateInputName(firstArgument)
                        .then(() => {
                            generateTemplate(firstArgument)
                                .then(() => resolve())
                                .catch((err) => reject({ code: err.message }));
                        })
                        .catch((err) => {
                            if (err.message === "n001"){
                                reject({ code: "p001" });
                            } else if(err.message === "n002") {
                                reject({ code: "p002" });
                            }
                        });

                    break;
            }
        } else {
            generateTemplate()
                .then(() => resolve())
                .catch((err) => reject({ code: err.message }));
        }
    });
}

// MAIN APP
MainApp()
    .then((result) => {
        if (result.type !== undefined && result.type !== "info") {
            printOutResolve(result);
        }

        autoUpdateCheck().then((result) => {
            result[0] !== result[1] ?
                printUpdateMessage(result[1]) :
                null;
        })
        .catch((err) => printOutReject(err));
    })
    .catch((error) => {
        printOutReject(error);
    });
