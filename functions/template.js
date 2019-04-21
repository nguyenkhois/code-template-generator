'use strict';
const path = require("path");
const { fs, inquirer, CURR_DIR, createDirectoryContents } = require("../common/");

const templatePath = path.join(__dirname, "../templates/");
const templateFilePath = path.join(__dirname, "../templates-files/");

const { AppError } = require("./errorHandling");

// Project generation
/**
 * @param {*} projectName
 * @param {*} option = {
 *      gitSupport: false
 * }
 */
function generateTemplate(projectName = "", option = { gitSupport: false, subFlags: [] }) {
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
                    if (/^(?![-.])([A-Za-z-_.\d])+([A-Za-z\d])+$/.test(input))
                        return true;
                    else
                        return false;
                }
            }
        ];
        let QUESTIONS = [];

        projectName.length !== 0 ?
            QUESTIONS = choiceList.slice(0, 1) : // Project name is not null and we don't ask again
            QUESTIONS = choiceList; // Project name is null therefor we have two questions

        inquirer.prompt(QUESTIONS)
            .then((answers) => {
                const chosenProjectTemplate = answers.projectChoice;
                const chosenProjectName = projectName.length !== 0 ?
                    projectName :
                    answers.projectName;

                const chosenTemplatePath = templatePath + chosenProjectTemplate;
                const newProjectPath = `${CURR_DIR}/${chosenProjectName}`;

                if (!fs.existsSync(newProjectPath)) {
                    fs.mkdirSync(newProjectPath);

                    createDirectoryContents(fs, chosenTemplatePath, newProjectPath)
                        .then(() => {
                            // Generate .gitignore file and run the "git init" command
                            if (option.gitSupport === true) {
                                gitInstallation(chosenProjectName)
                                    .then(() => generateGitignoreFile(chosenProjectName))
                                    .catch((err) => reject(err));
                            }

                            // Dependency installation
                            if (option.subFlags.indexOf("--no-install") === -1) {
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

// Git support installation
function gitInstallation(projectName) {
    return new Promise((resolve, reject) => {
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

// Installation of all needed dependencies
function dependencyInstallation(projectName) {
    return new Promise((resolve, reject) => {
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
 * Input data is (argument, function, extraOption)
 */
function generateFile(argFullFileName = null, fnGetAndReplaceFileContent, extraOption = {}) {
    return new Promise(function (resolve, reject) {
        if (argFullFileName !== null) {
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
                    if (extraOption.subDir !== undefined && extraOption.subDir !== "") {
                        newFullFilePath = `${CURR_DIR}/${extraOption.subDir}/${argFullFileName}`;
                    }
                }

                // Check if the file is found
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

        } else {
            reject(new AppError("f002")); // The file name is missing
        }
    });
}

function generateGitignoreFile(subDirectory = "") {
    const extraOption = { subDir: subDirectory };

    return new Promise((resolve, reject) => {
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
 * Using for a single component generation
 * @param {*} componentName : <component-name.js>
 * @param {*} option : [-c][-r] // React or React-Redux component
 * option = {
 *      componentType: 'string',
 *      fullComponent: boolean,
 *      fullCSSFileName: 'string'
 * }
 * @param {*} extraOption : { JSON } // using for creating a full component that is a directory with *.js, *.css are within
 * extraOption = {
 *      subDir: 'string'
 * }
 */
function generateComponent(componentName = null, option = { componentType: "" }, extraOption = {}) {
    return new Promise((resolve, reject) => {

        // Call an other Promise function -> input data is (argument, function)
        generateFile(componentName, function (filteredName) {
            let templateName;
            const { componentType, fullComponent, fullCSSFileName } = option;
            const componentRegExp = /YourComponentName/g;
            const cssRegExp = /\/\/ImportYourCSS/g;

            // Chosen template file
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

            const className = filteredName.replace(/-/g, "");
            let replacedContent = originalContent.replace(componentRegExp, className);

            // Return file content
            if (fullComponent && fullCSSFileName &&
                fullComponent === true && fullCSSFileName.length > 0) {
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
 * A full component that is a directory with *.js, *.css are within.
 * @param {*} componentName : <component-name> is <directory-name> now.
 * @param {*} option : {
 *      componentType: [-fc][-fr] // React or React-Redux component
 * }
 */
function generateFullComponent(componentName = null, option = { componentType: "" }) {
    return new Promise((resolve, reject) => {
        const { componentType } = option;
        const newFullDirectoryPath = `${CURR_DIR}/${componentName}`;

        if (!fs.existsSync(newFullDirectoryPath)) {
            fs.mkdirSync(newFullDirectoryPath);

            // Create file name
            const newFullJSFileName = `${componentName}.js`;
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
