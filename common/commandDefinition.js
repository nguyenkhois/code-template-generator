const { Command } = require("command-handling");

// Option definitions for the application
const command = new Command();

command
    .option("-root", "", "Root of a command") // Special case
    .option("-g", "--git", "Run git init and generate a .gitignore file")
    .option("-c", "--component", "Generate a React component file (*.js, *.jsx)")
    .option("-r", "--redux-component", "Generate a React-Redux component file")
    .option("-h","--hooks","Generate a React hooks component file")
    .option("-fc", "--full-component", "Generate a full React component (*.css, *.js, *.jsx)")
    .option("-fr", "--full-redux-component", "Generate a full React-Redux component")
    .option("-fh","--full-hooks-component","Generate a full React hooks component")
    .option("-i", "--gitignore", "Generate a .gitignore file")
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View help documentation")
    .option("-u", "--update", "Install the latest stable version")
    .option("-cf", "--config", "Config for this application")
    .option("-m", "--my-asset", "Retrieve assets from a specific directory")
    .subOption("-root", "--no-install", "No run git init and no install dependencies")
    .subOption("-g", "--no-install", "No install dependencies")
    .subOption("-fc", "--jsx", "Using *.jsx for React component")
    .subOption("-fr", "--jsx", "Using *.jsx for React-Redux component")
    .subOption("-fh", "--jsx", "Using *.jsx for React hooks component")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");
// End of definitions

module.exports = { command };
