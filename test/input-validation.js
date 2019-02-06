const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const { validateInputName } = require("../functions/");

const { AppError } = require("../functions/errorHandling");

/**
 * .rejectedWith() is chai-as-promised's syntax
 */

describe("FUNCTIONS/functions.js - validateInputName()", function () {
    it("Valid input name -> 'NewProject'", function () {
        return expect(validateInputName("NewProject")).to.eventually.equal(true);
    });

    it("Invalid input name -> '-*NewProject_'", function () {
        return expect(validateInputName("-*NewProject_")).to.eventually
            .be.rejectedWith("")
            .and.be.an.instanceOf(AppError)
            .and.have.property('code', 'n001');
    });

    it('NULL input name -> null', function () {
        return expect(validateInputName(null)).to.eventually
            .be.rejectedWith("")
            .and.be.an.instanceOf(AppError)
            .and.have.property('code', 'n002');
    });

    it("Undefined input name -> undefined", function () {
        return expect(validateInputName()).to.eventually
            .be.rejectedWith("")
            .and.be.an.instanceOf(AppError)
            .and.have.property('code', 'n002');
    });

    it("Empty input name -> ''", function () {
        return expect(validateInputName("")).to.eventually
            .be.rejectedWith("")
            .and.be.an.instanceOf(AppError)
            .and.have.property('code', 'n002');
    });
});
