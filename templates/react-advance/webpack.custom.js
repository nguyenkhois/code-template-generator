module.exports = {
    entryPoints: {
        // index.js is default and you can add many more entry points here
        index: './src/index.js',
    },
    htmlTemplate: './src/index.html',
    distDir: './dist', // Distribution directory
    serverPort: 9000
};