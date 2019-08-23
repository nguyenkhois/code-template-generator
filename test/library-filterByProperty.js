const { expect } = require("chai");

const { filterByProperty } = require("../helpers/");

describe("COMMON/library.js - filterByProperty()", function () {
    const inputObjectArray = [
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
