const { Command } = require("command-handling");

// Option definitions for the application
const command = new Command();

command
    .option("-root", "", "Root of a command") // Special case
    .option("-g", "--git", "Run git init and generate a .gitignore file")
    .option("-c", "--component", "Generate a React component file (*.js, *.jsx, *.ts, *.tsx)")
    .option("-f", "--full-component", "Generate a full React component with two files *.css, *.js (or *.jsx, *.tsx)")
    .option("-i", "--gitignore", "Generate a .gitignore file")
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View help documentation")
    .option("-u", "--update", "Update to the latest stable version")
    .option("-cf", "--config", "Configuration for the application")
    .option("-a", "--asset", "Retrieve your assets from a specific directory")
    .subOption("-root", "--no-install", "No run git init and no install dependencies")
    .subOption("-g", "--no-install", "No install dependencies")
    .subOption("-f", "--jsx", "Using *.jsx for a full component")
    .subOption("-f", "--tsx", "Using *.tsx for a full component")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");

module.exports = { command };
