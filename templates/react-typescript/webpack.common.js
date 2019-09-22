const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require("webpack-notifier");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { entryPoints, distDir, htmlTemplate } = require('./webpack.custom'); // Using your own configs

module.exports = {
    entry: entryPoints,// which file(s) to begin with, 
    output: {
        path: path.join(__dirname, distDir), // what folder to put bundle in
        filename: '[name].[hash].js' // what name to use for bundle
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: "ts-loader",
                include: [
                    path.join(__dirname, "src")
                ]
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
                include: [
                    path.join(__dirname, "src")
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new WebpackNotifierPlugin({ alwaysNotify: true }),
        new HtmlWebpackPlugin({ template: htmlTemplate }),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!images'] // No remove "images" for a faster development
        }),
        new WriteFilePlugin({
            test: /\.(png|jpg|gif|svg|ico)$/i
        }),
        new CopyWebpackPlugin([
            { from: 'src/images', to: 'images' }
        ])
    ]
};