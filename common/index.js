const library = require("./library");
const regularExpression = /^(?![-.])([A-Za-z-_.\d])+([A-Za-z\d])+$/;
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
    ...library,
    regularExpression,
    supportedTemplate
};
