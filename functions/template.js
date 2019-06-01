'use strict';
const path = require("path");
const { fs, inquirer, CURR_DIR } = require("../common/");
const { createDirectoryContents, stringHelper } = require("../helpers/");
const { AppError } = require("./errorHandling");

const templatePath = path.join(__dirname, "../templates/");
const templateFilePath = path.join(__dirname, "../templates-files/");

/**
 * Project generation
 * @param {string} projectName
 * @param {object} option
 */
function generateTemplate(inputProjectName, option = { gitSupport: false, subFlags: [] }) {
    return new Promise((resolve, reject) => {
        const CHOICES = fs.readdirSync(templatePath);
        const choiceList = [
            {
                name: "projectChoice",
                type: "list",
                message: "What project template would you like to generate?",
                choices: CHOICES
            },
            {
                name: "projectName",
                type: "input",
                message: "Project name:",
                validate: function (input) {
                    const regExr = /^(?![-.])([A-Za-z-_.\d])+([A-Za-z\d])+$/;
                    return regExr.test(input);
                }
            }
        ];
        let QUESTIONS = [];

        inputProjectName ?
            QUESTIONS = choiceList.slice(0, 1) : // Project name already exists therefor we don't ask again
            QUESTIONS = choiceList; // Project name is null therefor we must have two questions

        inquirer.prompt(QUESTIONS)
            .then((answers) => {
                const { projectChoice, projectName } = answers;

                const chosenProjectTemplate = projectChoice;
                const chosenProjectName = inputProjectName ? inputProjectName : projectName;

                const chosenTemplatePath = templatePath + chosenProjectTemplate;
                const newProjectPath = `${CURR_DIR}/${chosenProjectName}`;

                if (!fs.existsSync(newProjectPath)) {
                    fs.mkdirSync(newProjectPath);

                    createDirectoryContents(fs, chosenTemplatePath, newProjectPath)
                        .then(() => {
                            const { gitSupport, subFlags } = option;

                            // Generate .gitignore file and run the "git init" command
                            if (gitSupport) {
                                gitInstallation(chosenProjectName)
                                    .then(() => generateGitignoreFile(chosenProjectName))
                                    .catch((err) => reject(err));
                            }

                            // Dependency installation
                            if (subFlags.indexOf("--no-install") === -1) {
                                dependencyInstallation(chosenProjectName)
                                    .then(() => resolve({
                                        name: chosenProjectName,
                                        template: chosenProjectTemplate
                                    }))
                                    .catch((err) => reject(err));
                            } else {
                                // Sub flag "--no-install" is found => no install dependencies
                                resolve({
                                    name: chosenProjectName,
                                    template: chosenProjectTemplate
                                });
                            }
                        })
                        .catch((err) => reject(err));
                } else {
                    reject(new AppError("d001")); // A subdirectory or file already exists
                }
            })
            .catch((err) => reject(err));
    });
}

/**
 * Running the command "git init"
 * @param {string} projectName
 */
function gitInstallation(projectName) {
    return new Promise((resolve, reject) => {
        if (!projectName) {
            reject(new Error("The projectName variable can not empty"));
            return;
        }

        console.log("\nRunning the git init command...");
        const exec = require("child_process").exec;

        exec(`cd ${projectName} && git init`, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(true);
        });
    });
}

/**
 * Installation of all needed dependencies
 * @param {string} projectName
 */
function dependencyInstallation(projectName) {
    return new Promise((resolve, reject) => {
        if (!projectName) {
            reject(new Error("Missing the projectName variable"));
            return;
        }

        const exec = require("child_process").exec;

        console.log("\nStarting the installation of all needed dependencies...");
        exec(`cd ${projectName} && npm i`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            console.log(`\n\x1b[32mDone!\x1b[0m npm ${stdout}`);

            if (stderr !== "") {
                console.log(`\x1b[35mInformation\x1b[0m: ${stderr}`);
            }

            resolve(true);
        });
    });
}

/**
 * Component generation - Using Higher-Order Function (HOF)
 * @param {string} argFullFileName
 * @param {callback} fnGetAndReplaceFileContent
 * @param {object} extraOption
 */
function generateFile(argFullFileName = null, fnGetAndReplaceFileContent, extraOption = {}) {
    return new Promise(function (resolve, reject) {
        if (!argFullFileName) {
            reject(new AppError("f002")); // The file name is missing
            return;
        }

        const supportedExtension = ["js", "jsx", "gitignore", "css"];
        const seekingExtension = argFullFileName.split(".");

        let fileExtension = "";
        let filteredName = "";

        if (seekingExtension.length > 1) {
            fileExtension = seekingExtension[seekingExtension.length - 1];
            filteredName = seekingExtension.slice(0, seekingExtension.length - 1).join("");
        }

        if (supportedExtension.indexOf(fileExtension) > -1) {
            // Check if the file will be created in a sub directory
            let newFullFilePath = `${CURR_DIR}/${argFullFileName}`; // Default is in the current directory

            if (Object.keys(extraOption).length > 0) {
                const { subDir } = extraOption;
                if (subDir) {
                    newFullFilePath = `${CURR_DIR}/${subDir}/${argFullFileName}`;
                }
            }

            // Check if the file is not found
            if (!fs.existsSync(newFullFilePath)) {
                fs.writeFile(newFullFilePath, fnGetAndReplaceFileContent(filteredName), (err) => {
                    if (!err) {
                        resolve(argFullFileName);
                    } else {
                        reject(err);
                    }
                });
            } else {
                reject(new AppError("f003")); // A subdirectory or file already exists
            }

        } else {
            reject(new AppError("f001")); // The file extension is not supported
        }
    });
}

/**
 * .gitignore file generation
 * @param {string} subDirectory
 */
function generateGitignoreFile(subDirectory) {
    return new Promise((resolve, reject) => {
        if (!subDirectory) {
            reject(new Error("Missing the subDirectory variable"));
            return;
        }

        const extraOption = { subDir: subDirectory };

        generateFile(".gitignore", function () {
            const gitignoreTemplatePath = path.join(templateFilePath, "/gitignore.template");
            const gitignoreContent = fs.readFileSync(gitignoreTemplatePath);

            return gitignoreContent;
        }, extraOption)
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
}

/**
 * Single component generation
 * @param {string} componentName is like <component-name.js>
 * @param {object} option = {
 *      componentType: string, // [-c][-r][-h] -> React, React-Redux, React hooks component
 *      fullComponent: boolean,
 *      fullCSSFileName: string
 * }
 *
 * Using for creating a full component that is a directory with *.js, *.jsx, *.css are within
 * @param {object} extraOption = { subDir: string }
 */
function generateComponent(componentName = null, option = { componentType: "" }, extraOption = {}) {
    return new Promise((resolve, reject) => {
        if (!componentName) {
            reject(new Error("Missing the componentName variable"));
            return;
        }

        // Call an other Promise function -> input data is (argument, function)
        generateFile(componentName, function (filteredName) {
            const { componentType, fullComponent, fullCSSFileName } = option;
            const componentRegExp = /YourComponentName/g;
            const cssRegExp = /\/\/ImportYourCSS/g;

            // Chosen template file
            let templateName;
            switch (componentType) {
                case "-r":
                    templateName = "/js-redux-component.template";
                    break;

                case "-h":
                    templateName = "/js-hooks-component.template";
                    break;

                default:
                    templateName = "/js-component.template";
                    break;
            }

            const componentTemplatePath = path.join(templateFilePath, templateName);
            const originalContent = fs.readFileSync(componentTemplatePath, "utf8");

            let className = filteredName.replace(/[-_]/g, "");
            className = stringHelper.firstCharToUpperCase(className);

            let replacedContent = originalContent.replace(componentRegExp, className);

            // Return file content
            if (fullComponent && fullCSSFileName && fullCSSFileName.length > 0) {
                return replacedContent.replace(cssRegExp, `import './${fullCSSFileName}';`);
            } else {
                return replacedContent.replace(cssRegExp, ""); // Clear comment in the template file
            }

        }, extraOption)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });
}

/**
 * Full component generation
 * A full component that is a directory with *.js (or *.jsx) and *.css are within.
 * @param {string} componentName is like <component-name> that is a <directory-name> now.
 * @param {object} option = {
 *      componentType: string, // [-fc][-fr][-fh] -> React, React-Redux, React hooks component
 *      subFlags: array
 * }
 */
function generateFullComponent(componentName = null, option = { componentType: "", subFlags: [] }) {
    return new Promise((resolve, reject) => {
        if (!componentName) {
            reject(new Error("Missing the componentName variable"));
            return;
        }

        const { componentType, subFlags } = option;
        const supportedExtenstions = ["js", "jsx"];
        const defaultExtension = "js";
        const newFullDirectoryPath = `${CURR_DIR}/${componentName}`;

        // Identify extension
        let componentExtension = defaultExtension;
        let isBreak = false;
        if (subFlags.length > 0) {
            const subFlagsLength = subFlags.length;
            for (let i = 0; i < subFlagsLength; i++) {
                const foundExtension = subFlags[i].slice(2); // Remove symbol -- in subFlag
                if (supportedExtenstions.indexOf(foundExtension) > -1) {
                    componentExtension = foundExtension;
                    isBreak = true;
                }

                if (isBreak) {
                    break;
                }
            }
        }

        if (!fs.existsSync(newFullDirectoryPath)) {
            fs.mkdirSync(newFullDirectoryPath);

            // Create file name
            const newFullJSFileName = `${componentName}.${componentExtension}`;
            const newFullCSSFileName = `${componentName}.css`;

            // Chosen component type - React - React-Redux - React hooks
            let compType;
            switch (componentType) {
                case "-fr":
                    compType = "-r"; // React-Redux component
                    break;

                case "-fh":
                    compType = "-h"; // React hooks component
                    break;

                default:
                    compType = "-c"; // React component
                    break;
            }

            // Create the new option
            const newOption = {
                componentType: compType,
                fullComponent: true,
                fullCSSFileName: newFullCSSFileName
            };

            const extraOption = {
                subDir: componentName
            };

            // Generate JS file
            const generateJSFile = generateComponent(newFullJSFileName, newOption, extraOption);

            // Generate CSS file
            const generateCSSFile = generateFile(newFullCSSFileName, function () {
                return `/* CSS for ${componentName} component */`;
            }, extraOption);

            // Combination for all promises
            Promise.all([generateJSFile, generateCSSFile])
                .then(() => resolve(componentName))
                .catch((err) => reject(err));

        } else {
            reject(new AppError("d001")); // A subdirectory or file already exists
        }
    });
}

module.exports = {
    generateTemplate,
    generateGitignoreFile,
    generateComponent,
    generateFullComponent
};
