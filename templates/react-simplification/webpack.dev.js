const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const { distDir, serverPort } = require('./webpack.custom');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, distDir), // the root for the server
        watchContentBase: true, // so we reload if other stuff like CSS changes
        port: serverPort, // it'll now be at http://localhost:9000
        watchOptions: {
            ignored: /node_modules/
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
});