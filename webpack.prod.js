var webpack = require('webpack');
var path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const WebpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const entryPath = path.join(__dirname, './src');

const outputPath = path.join(__dirname, './dist');

const config = {
    entry:{
        app: [
            'babel-polyfill',
            'whatwg-fetch',
            path.join(entryPath, 'index.js'),
        ]
    },
    module:{
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(css|less)$/,
                        loader: ExtractTextPlugin.extract(
                            {
                                fallback: {
                                    loader: require.resolve('style-loader'),
                                    options: {
                                        hmr: false,
                                    },
                                },
                                use: [
                                    {
                                        loader: require.resolve('css-loader'),
                                        options: {
                                            importLoaders: 1,
                                            minimize: true,
                                            sourceMap: true,
                                            alias: { '../img': path.join(__dirname, 'public/img') }
                                        },
                                    },
                                    {
                                        loader: require.resolve('postcss-loader'),
                                        options: {
                                            // Necessary for external CSS imports to work
                                            // https://github.com/facebookincubator/create-react-app/issues/2677
                                            ident: 'postcss',
                                            plugins: () => [
                                                require('postcss-flexbugs-fixes'),
                                                autoprefixer({
                                                    browsers: [
                                                        '>1%',
                                                        'last 4 versions',
                                                        'Firefox ESR',
                                                        'not ie < 9', // React doesn't support IE8 anyway
                                                    ],
                                                    flexbox: 'no-2009',
                                                }),
                                            ],
                                        },
                                    },
                                    {
                                        loader: 'less-loader',
                                        options: {
                                            sourceMap: true,
                                            javascriptEnabled: true
                                            // modifyVars: customizeTheme
                                        },
                                    },
                                ],
                            }
                        ),
                    },
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        // both development and production
        // injected the webpack bundles to `index.html` file.
        // @see: https://webpack.js.org/plugins/html-webpack-plugin/
        // More config @see: https://github.com/jantimon/html-webpack-plugin#configuration
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),

        // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        // Minify all javascript, switch loaders to minimizing mode
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                // 删除未引用的函数和变量
                unused: true,
                // 删除无法访问的代码
                dead_code: true,
                // display warnings when dropping unreachable code or unused declarations etc.
                warnings: false
            },
            output: {
                // 是否保留注释
                comments: false
            },
            uglifyOptions: {
                compress: {
                    // 删除debugger语句
                    drop_debugger: true,
                    // 整个语句将被丢弃
                    pure_funcs: ['console.debug'],
                },
            }
        }),

        new webpack.NoEmitOnErrorsPlugin(),

        new ExtractTextPlugin("[name].[hash].css"),

        new CopyWebpackPlugin(
            [
                {
                    from: path.join(__dirname, 'public/fonts'),
                    to: path.join(outputPath, 'fonts/'),
                    // context: 'public'
                },
                {
                    from: path.join(__dirname, 'public/img'),
                    to: path.join(outputPath, 'img/'),
                }
            ]
        ),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}

module.exports = WebpackMerge(commonConfig, config);
