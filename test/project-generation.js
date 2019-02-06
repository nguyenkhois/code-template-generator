const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const inquirer = require("inquirer");
const { generateTemplate } = require("../functions/template");

const { AppError } = require("../functions/errorHandling");

describe("FUNCTIONS/template.js - Project generation", function () {
    let backup;
    const testProject = {
        "projectName": "_TestProjectSimpleExpressServer",
        "projectChoice": "simple-express-server"
    };

    before(function () {
        backup = inquirer.prompt;
        inquirer.prompt = function () {
            return Promise.resolve(testProject);
        }
    })

    it("Generate a project by chosen template", function () {
        generateTemplate()
            .then((resolving) => {
                expect(resolving).to.have.property("template", testProject.projectChoice);
                expect(resolving).to.have.property("name", testProject.projectName);
            })
            .catch((err) => {
                console.log(`\tError: { code: '${err.code}', message: '${err.message}'}`);
            });
    })

    it("Project directory already exists", function () {
        return expect(generateTemplate()).to.eventually
            .be.rejectedWith("")
            .and.be.an.instanceOf(AppError)
            .and.have.property('code', 'd001');
    });

    after(() => {
        inquirer.prompt = backup;
    })
});