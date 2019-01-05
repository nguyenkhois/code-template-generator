const errorCode = [
    // For name
    {
        code: "n001",
        error: "The input name is empty",
        solution: ""
    },
    {
        code: "n002",
        error: "The input name is invalid",
        solution: ""
    },

    // For file
    {
        code: "f001",
        error: "The file extension is not supported",
        solution: "The supported file extensions are  *.js, *.jsx"
    },
    {
        code: "f002",
        error: "The file name is empty",
        solution: "You may want to enter a file name"
    },
    {
        code: "f003",
        error: "The file already exists",
        solution: "You may want to choose another file name"
    },
    
    // For component
    {
        code: "c001",
        error: "The component name is invalid",
        solution: "You may want to choose another component name"
    },
    {
        code: "c002",
        error: "The component name is empty",
        solution: "You may want to enter a component name"
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
        solution: "You may want to choose another component name"
    },
    {
        code: "p002",
        error: "The project name is empty",
        solution: "You may want to enter a component name"
    },

    // For other information
    {
        code: "i001",
        error: "Can not get the installed version",
        solution: "Check your internet connection or install the latest stable version"
    }

    /* {
        code: "",
        error: "",
        solution: ""
    }, */
];

module.exports = {
    errorCode
}