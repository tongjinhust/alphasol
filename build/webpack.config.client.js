const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = {
    entry: {
        app: './src/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, './dev'),
        publicPath: "/",
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    esModule: false
                }
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            babelOptions: {
                                babelrc: false,
                                plugins: [
                                    "react-hot-loader/babel"
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader"
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, "../tsconfig.json")
            })
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "build/index.html",
            favicon: "build/favicon.ico"
        }),
    ],
    devServer: {
        historyApiFallback: true,
        host: "127.0.0.1",
        port: 3000
    },
}