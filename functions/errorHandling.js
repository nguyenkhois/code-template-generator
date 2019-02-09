const helpCommandText = "\nTip! Run \x1b[33mgenerate -help\x1b[0m to view more information";

const errorCodeList = [
    // For name
    {
        code: "n001",
        error: "The input name is invalid",
        solution: ""
    },
    {
        code: "n002",
        error: "The input name is empty",
        solution: ""
    },

    // For file - single component
    {
        code: "f001",
        error: "The file extension is not supported",
        solution: `The supported file extensions are  *.js, *.jsx.
            \n${helpCommandText}`
    },
    {
        code: "f002",
        error: "The file name is empty",
        solution: ""
    },
    {
        code: "f003",
        error: "The file already exists",
        solution: "You may want to choose another file name"
    },

    // For single component
    {
        code: "c001",
        error: "The component name is invalid",
        solution: `It may only include letters, numbers, underscores and hashes. You may want to choose another component name.
            \n${helpCommandText}`
    },
    {
        code: "c002",
        error: "The component name is empty",
        solution: `You may want to use the command \x1b[33mgenerate <-c>[<-r>] <component-name.js>\x1b[0m for the component generation.
            \n${helpCommandText}`
    },

    // For full component
    {
        code: "fu001",
        error: "The component name is invalid",
        solution: `It may only include letters, numbers, underscores and hashes. You may want to choose another component name.
            \n${helpCommandText}`
    },
    {
        code: "fu002",
        error: "The component name is empty",
        solution: `You may want to use the command \x1b[33mgenerate <-fc>[<-fr>] <component-name>\x1b[0m for the component generation.
            \n${helpCommandText}`
    },

    // For directory
    {
        code: "d001",
        error: "The directory already exists",
        solution: "You may want to choose another directory name"
    },

    // For project
    {
        code: "p001",
        error: "The project name is invalid",
        solution: `It may only include letters, numbers, underscores and dashes but it does not end with special characters. You may want to choose another project name.
            \n${helpCommandText}`
    },
    {
        code: "p002",
        error: "The project name is empty",
        solution: `You may want to use the command \x1b[33mgenerate [-g] <project-name>\x1b[0m for the project generation.
            \n${helpCommandText}`
    },

    // For other information
    {
        code: "i001",
        error: "Can not get the installed version",
        solution: "You may want to try install the latest stable version to fix it"
    },
    {
        code: "i002",
        error: "Can not connect to registry.npmjs.com for the latest stable version checking",
        solution: "You may want to check again the internet connection"
    },

    // For Node.js environment
    {
        code: "n243",
        error: "EACCES: permission denied. The operation was rejected by your operating system",
        solution: "You may want to try again by using administrator permission." +
            "\nExample: \x1b[33msudo generate --update\x1b[0m (Using \x1b[33msudo\x1b[0m on MacOS or Ubuntu system)"
    },

    // For input asset path
    {
        code: "pa001",
        error: "The local path is invalid",
        solution: `It may only include letters, numbers, underscores and dashes but it does not end with special characters.\n${helpCommandText}`
    },
    {
        code: "pa002",
        error: "The local path is empty",
        solution: `Syntax is \x1b[33mgenerate -cf \x1b[90m--set-asset\x1b[0m \x1b[33m<path>\x1b[0m.\n${helpCommandText}`
    },
    {
        code: "pa003",
        error: "Unknown command or missing the sub option",
        solution: `Example for syntax: \x1b[33mgenerate -cf \x1b[90m--set-asset\x1b[0m \x1b[33m<path>\x1b[0m. \n${helpCommandText}`
    },
    {
        code: "pa004",
        error: "The local path is not found",
        solution: `You may want to check again your local path.\n${helpCommandText}`
    },
    {
        code: "pa005",
        error: "The local path for your asset(s) is not found",
        solution: `You need define the path by command \x1b[33mgenerate -cf --set-asset <path>\x1b[0m.\n${helpCommandText}`
    },
    {
        code: "pa006",
        error: "Can not retrieve your asset(s)",
        solution: `It may be already exist in the current work directory`
    },
    {
        code: "pa007",
        error: "Asset directory is empty",
        solution: `You need have your files or sub directories in this directory`
    }
];

/**
 * Return always an Error object
 * @param {*} error
 */
function errorIdentification(error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    switch (errorCode) {
        // Internet connection is not found
        case "ENOTFOUND":
            if (/ENOTFOUND/g.test(errorMessage)) {
                return new AppError("i002", "Can not connect to registry.npmjs.com");
            }
            return error;

        // MacOS and Ubuntu - The user has not administrator permission
        case 243:
            if (/permission denied/g.test(errorMessage)) {
                return new AppError("n243", "Permission denied");
            }
            return error;

        default:
            return error;
    }
}

// Custom Error object
class AppError extends Error {
    constructor(code = "UNKNOWN", message = "") {
        super();

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.message = message;
    }
}

module.exports = {
    AppError,
    errorCodeList,
    errorIdentification
};
