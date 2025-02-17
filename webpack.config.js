const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    plugins: [
        new BundleAnalyzerPlugin({
            generateStatsFile: true,
        }),
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
            filename: "[path][query]",
            algorithm: "gzip",
            deleteOriginalAssets: false,
        }),
    ],
};