const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer")

const {version, name, description} = require("../package.json");

const LOGO = `
`

const config = {
    mode: "production",
    entry: {
        [name]: ["./src/components/main.js"]
    },

    output: {
        library: name,
        libraryTarget: "umd",
        umdNamedDefine: true,
        path: path.join(process.cwd(), "build"),
        filename: "[name].min.js"
    },
    externals: {
        react: {
            root: "React",
            commonjs2: "react",
            commonjs: "react",
            amd: "react"
        },
        "react-dom": {
            root: "ReactDOM",
            commonjs2: "react-dom",
            commonjs: "react-dom",
            amd: "react-dom"
        }
    },
    resolve: {
        enforceExtension: false,
        extensions: [".js", ".jsx", ".json", ".styl", ".css"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ],
                exclude: "/node_modules/",
                include: [path.resolve("src/components")]
            },
            {
                test: /\.styl$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "stylus-loader",
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|cur|ico)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {},
                }
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: {removeAll: true},
                        },
                    ],
                },
            }),
        ],
        emitOnErrors: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].min.css"
        }),
        new webpack.BannerPlugin(` \n ${name} v${version} \n ${description}
            \n ${LOGO}\n ${fs.readFileSync(path.join(process.cwd(), "LICENSE"))}
        `),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
            __DEBUG__: false,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}),
        // new BundleAnalyzerPlugin(),
    ]
};

module.exports = config;