const { expect } = require("chai");

const { filterByProperty } = require("../common/");

describe("COMMON/library.js - filterByProperty()", function () {
    const inputObjectArray = [
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
    const expectResult = [
        {
            "name": "react-typescript",
            "type": "react"
        }
    ];

    it("The object should found in array", function (done) {
        filterByProperty(inputObjectArray, "name", "react-typescript")
            .then((result) => {
                expect(result).to.deep.equal(expectResult);
                done();
            });
    });

    it("The object should not found in array", function (done) {
        filterByProperty(inputObjectArray, "name", "react-typescript-3")
            .then((result) => {
                expect(result).to.not.equal(expectResult);
                done();
            });
    });
});
