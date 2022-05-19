const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path")

const PATH_JS = "./src/client/js/"

module.exports = {
    entry: {
        main: PATH_JS + "main.js",
        videoPlayer: PATH_JS + "videoPlayer.js",
        recorder: PATH_JS + "recorder.js",
        mouseover: PATH_JS + "mouseover.js",
        commentSection: PATH_JS + "commentSection.js",
        countingDate: PATH_JS + "countingDate.js",
        like: PATH_JS + "like.js",
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]]
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
}