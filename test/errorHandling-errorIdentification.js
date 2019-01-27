const { expect } = require("chai");

const { errorIdentification } = require("../functions/");

describe("FUNCTIONS/errorHandling.js - errorIdentification()", function () {
    it("Internet connection is not found", function () {
        expect(errorIdentification(Error("ENOTFOUND")), Error("i002"));
    });
});
