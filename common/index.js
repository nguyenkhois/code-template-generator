const fs = require("fs");
const inquirer = require('inquirer');

const CURR_DIR = process.cwd();
const regularExpression = /^(?![-.])([A-Za-z-_.\d])+([A-Za-z\d])+$/gi;
const pathRegExr = /^([a-zA-Z/])+([a-zA-Z-_.:\d/\\])+([a-zA-Z\d/\\])+((?!\/\s).)*$/gi;
const supportedTemplate = [
    {
        "name": "react-hooks",
        "type": "react"
    },
    {
        "name": "react-sass",
        "type": "react"
    },
    {
        "name": "react-typescript",
        "type": "react"
    },
    {
        "name": "simple-express-server",
        "type": "express"
    }
];

module.exports = {
    fs,
    inquirer,
    CURR_DIR,
    regularExpression,
    supportedTemplate,
    pathRegExr
};
