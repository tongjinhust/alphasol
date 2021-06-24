const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = {
    entry: {
        app: './src/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, '../distclient'),
        publicPath: "/",
        filename: "[name]-[hash:8].js"
    },
    module: {
        rules: [
            // {
            //     test: /\.(jpeg|jpg|png|gif|svg)$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 name: "[name]-[hash:8].[ext]"
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "[name]-[hash:8].[ext]",
                            outputPath: "images/",
                            esModule: false
                        }
                    }
                ]
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
        })
    ],
}