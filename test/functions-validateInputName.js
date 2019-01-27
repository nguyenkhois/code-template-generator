const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const { validateInputName } = require("../functions/");

/**
 * .rejectedWith() is chai-as-promised's syntax
 */

describe("FUNCTIONS/functions.js - validateInputName()", function () {
    it("Valid input name", function () {
        return expect(validateInputName("nothing")).to.eventually.equal(true);
    });

    it('Invalid input name', function() {
        return expect(validateInputName("-nothing")).to.be.rejectedWith("n001");
    });

    it('NULL input name', function() {
        return expect(validateInputName(null)).to.be.rejectedWith("n002");
    });

    it('Undefined input name', function() {
        return expect(validateInputName()).to.be.rejectedWith("n002");
    });

    it('Empty input name', function() {
        return expect(validateInputName("")).to.be.rejectedWith("n002");
    });
});
