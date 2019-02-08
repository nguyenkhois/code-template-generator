// System importing
const fs = require("fs");
const inquirer = require('inquirer');

const CURR_DIR = process.cwd();

const library = require("./library");
const regularExpression = /^(?![-.])([A-Za-z-_.\d])+([A-Za-z\d])+$/gi;
const pathRegExr = /^([a-zA-Z/])+([a-zA-Z-_.:\d/\\])+([a-zA-Z\d])$/gi;
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
    ...library,
    regularExpression,
    supportedTemplate,
    pathRegExr
};
