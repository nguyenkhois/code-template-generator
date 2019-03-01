const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css"
        })
    ]
});