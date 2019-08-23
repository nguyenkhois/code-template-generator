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
            return reject(new Error("The projectName variable can not empty"));
        }

        console.log("\nRunning the git init command...");
        const exec = require("child_process").exec;

        exec(`cd ${projectName} && git init`, (error) => {
            if (error) {
                return reject(error);
            }

            return resolve(true);
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
            return reject(new Error("Missing the projectName variable"));
        }

        const exec = require("child_process").exec;

        console.log("\nStarting the installation for all needed dependencies...");
        exec(`cd ${projectName} && npm i`, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }

            console.log(`\n\x1b[32mDone!\x1b[0m npm ${stdout}`);

            if (!stderr) {
                console.log(`\x1b[35mInformation\x1b[0m: ${stderr}`);
            }

            return resolve(true);
        });
    });
}

/**
 * Component generation - Using Higher-Order Function (HOF)
 * @param {string} argFullFileName
 * @param {callback} fnGetAndReplaceFileContent
 * @param {object} extraOption
 */
function generateFile(argFullFileName, fnGetAndReplaceFileContent, extraOption = {}) {
    return new Promise(function (resolve, reject) {
        if (!argFullFileName) {
            return reject(new AppError("f002")); // The file name is missing
        }

        const supportedExtension = ["js", "jsx", "tsx", "gitignore", "css"],
            seekingExtension = argFullFileName.split("."),
            seekingExtensionLength = seekingExtension.length;

        let fileExtension = "",
            filteredName = "";

        if (seekingExtensionLength) {
            fileExtension = seekingExtension.slice(-1)[0];
            filteredName = seekingExtension.slice(0, seekingExtensionLength - 1).join("");
        }

        if (supportedExtension.indexOf(fileExtension) > -1) {
            // Check if the file will be created in a sub directory
            let newFullFilePath = `${CURR_DIR}/${argFullFileName}`; // Default is in the current directory

            if (Object.keys(extraOption).length) {
                const { subDir } = extraOption;
                if (subDir) {
                    newFullFilePath = `${CURR_DIR}/${subDir}/${argFullFileName}`;
                }
            }

            // Check if the file is not found
            if (!fs.existsSync(newFullFilePath)) {
                fs.writeFile(newFullFilePath, fnGetAndReplaceFileContent(filteredName, fileExtension), (err) => {
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
 * @param {string} componentName is a file name (component-name.js)
 * @param {object} option = {
 *      isFullComponent: boolean,
 *      fullCSSFileName: string
 * }
 *
 * Only using when creating a full component that is a directory with two files
 * *.css, *.js (or *.jsx, *.tsx) that are within
 * @param {object} extraOption = { subDir: string }
 */
function generateComponent(componentName, option = {}, extraOption = {}) {

    return new Promise((resolve, reject) => {
        if (!componentName) {
            return reject(new Error("Missing the componentName variable"));
        }

        // Call an other Promise function -> input data is (argument, function)
        generateFile(componentName, function (filteredName, fileExtension) {
            const { isFullComponent, fullCSSFileName } = option;
            const componentRegExp = /YourComponentName/g;
            const cssRegExp = /\/\/ImportYourCSS/g;

            // Chosen template file
            let templateName;
            switch (fileExtension) {
                case "tsx":
                    templateName = "/ts-component.template";
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
            if (isFullComponent && fullCSSFileName && fullCSSFileName.length) {
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
 * A full component that is a directory with *.js (or *.jsx, *.ts, *.tsx) and *.css are within.
 * @param {string} componentName is like <component-name> that is a <directory-name> now.
 * @param {object} option = { subFlags: array }
 */
function generateFullComponent(componentName = null, option = { subFlags: [] }) {
    return new Promise((resolve, reject) => {
        if (!componentName) {
            return reject(new Error("Missing the componentName variable"));
        }

        const { subFlags } = option;
        const supportedExtenstions = ["js", "jsx", "tsx"];
        const defaultExtension = "js";
        const newFullDirectoryPath = `${CURR_DIR}/${componentName}`;

        // Identify extension
        let componentExtension = defaultExtension;
        let isBreak = false;
        const subFlagsLength = subFlags.length;
        if (subFlags.length) {
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
            const newFullJSFileName = `${componentName}.${componentExtension}`,
                newFullCSSFileName = `${componentName}.css`;

            // Create the new option
            const newOption = {
                isFullComponent: true,
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
