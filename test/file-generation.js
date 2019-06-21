const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const { generateGitignoreFile, generateComponent,
    generateFullComponent, AppError
} = require("../features/");

describe("FUNCTIONS/template.js - File generation", function () {
    describe("Generate .gitignore file", function () {
        it("File should not exist", function () {
            generateGitignoreFile()
                .then((filename) => {
                    return expect(filename).to.eventually.equal(".gitignore");
                })
                .catch((err) => {
                    console.log(`\tError: { code: '${err.code}', message: '${err.message}'}`);
                });
        });

        it("File should exist", function () {
            return expect(generateGitignoreFile()).to.eventually
                .be.rejectedWith("")
                .and.be.an.instanceOf(AppError)
                .and.have.property('code', 'f003');
        });
    });

    describe("Generate a single component (a file *.js or *.jsx)", function () {
        const componentName = "_TestComponent.js";

        it("Component should not exist", function () {
            generateComponent(componentName)
                .then((filename) => {
                    return expect(filename).to.equal(componentName);
                })
                .catch((err) => {
                    console.log(`\tError: { code: '${err.code}', message: '${err.message}'}`);
                });
        });

        it("Component should exist", function () {
            return expect(generateComponent(componentName)).to.eventually
                .be.rejectedWith("")
                .and.be.an.instanceOf(AppError)
                .and.have.property('code', 'f003');
        });
    });

    describe("Generate a full component (a directory with two files *.css, *.js)", function () {
        const componentName = "_TestComponent";

        it("Component directory should not exist", function () {
            generateFullComponent(componentName)
                .then((directoryName) => {
                    return expect(directoryName).to.equal(componentName);
                })
                .catch((err) => {
                    console.log(`\tError: { code: '${err.code}', message: '${err.message}'}`);
                });
        });

        it("Component directory should exist", function () {
            return expect(generateFullComponent(componentName)).to.eventually
                .be.rejectedWith("")
                .and.be.an.instanceOf(AppError)
                .and.have.property('code', 'd001');
        });
    });
});
