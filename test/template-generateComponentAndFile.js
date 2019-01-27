const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const { generateGitignoreFile,
    generateComponent,
    generateFullComponent
} = require("../functions/");

describe("FUNCTIONS/template.js", function () {
    describe("Generate .gitignore file", function () {
        it("Full test for both file exists and not exists", function () {
            generateGitignoreFile()
            .then((filename) => {
                return expect(filename).to.eventually.equal(".gitignore");
            })
            .catch((err) => {
                return expect(err, Error("f003"));
            });
        });

        /* it("File is not exists", function () {
            return expect(generateGitignoreFile()).to.eventually.equal(".gitignore");
        }); */

        it("File exists", function () {
            return expect(generateGitignoreFile()).to.be.rejectedWith("f003");
        });
    });

    describe("Generate a single component (a file *.js or *.jsx)", function () {
        const componentName = "_TestComponent.js";

        it("Full test for both component exists and not exists", function () {
            generateComponent(componentName)
            .then((filename) => {
                return expect(filename).to.eventually.equal(componentName);
            })
            .catch((err) => {
                return expect(err, Error("f003"));
            });
        });

        /* it("Component is not exists", function () {
            return expect(generateComponent(componentName)).to.eventually.equal(componentName);
        }); */

        it("Component exists", function () {
            return expect(generateComponent(componentName)).to.be.rejectedWith("f003");
        });
    });

    describe("Generate a full component (a directory with two files *.css, *.js)", function () {
        const componentName = "_TestComponent";

        it("Full test for both component exists and not exists", function () {
            generateFullComponent(componentName)
            .then((directoryName) => {
                return expect(directoryName).to.eventually.equal(componentName);
            })
            .catch((err) => {
                return expect(err, Error("d001"));
            });
        });

        /* it("Component is not exists", function () {
            return expect(generateFullComponent(componentName)).to.eventually.equal(componentName);
        }); */

        it("Component exists", function () {
            return expect(generateFullComponent(componentName)).to.be.rejectedWith("d001");
        });
    });
});
