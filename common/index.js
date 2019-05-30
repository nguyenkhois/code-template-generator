// System importing
const fs = require("fs");
const inquirer = require('inquirer');
const helpers = require("../helpers");

const CURR_DIR = process.cwd();
const regularExpression = /^(?![-.])([A-Za-z-_.\d])+([A-Za-z\d])+$/gi;
const pathRegExr = /^([a-zA-Z/])+([a-zA-Z-_.:\d/\\])+([a-zA-Z\d/\\])$/gi;
const supportedTemplate = [
    {
        "name": "react-advance",
        "type": "react"
    },
    {
        "name": "react-simplification",
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
    ...helpers,
    regularExpression,
    supportedTemplate,
    pathRegExr
};
