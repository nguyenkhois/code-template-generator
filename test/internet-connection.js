const { expect } = require("chai");

const { errorIdentification, AppError } = require("../features/");

describe("FUNCTIONS/errorHandling.js - errorIdentification(), AppError object", function () {
    it("Internet connection should not found", function () {
        expect(errorIdentification(new Error("ENOTFOUND"), new AppError("i002")));
    });
});
