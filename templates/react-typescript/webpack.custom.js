module.exports = {
    entryPoints: {
        // index is default and you can add many more entry points here
        index: './src/index.tsx',
    },
    htmlTemplate: './src/index.html',
    distDir: './dist', // Distribution directory
    serverPort: 9000
}