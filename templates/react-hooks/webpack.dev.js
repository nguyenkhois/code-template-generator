const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const { distDir, serverPort } = require('./webpack.custom');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, distDir), // Root for the local server
        watchContentBase: true,
        port: serverPort,
        watchOptions: {
            ignored: /node_modules/
        },
        hot: true,
        historyApiFallback: false
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});