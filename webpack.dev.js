var webpack = require('webpack');
var path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const entryPath = path.join(__dirname, './src');

const outputPath = path.join(__dirname, './dist');

const customizeTheme = require('./src/theme');

const port = 8000;

const config = {
    devtool: 'cheap-module-source-map',
    entry:{
        app: [
            'babel-polyfill',
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://localhost:${port}`,
            'webpack/hot/only-dev-server',
            'whatwg-fetch',
            path.join(entryPath, 'index.js'),
        ]
    },
    devServer: {
        contentBase: [entryPath, './node_modules', './public'],
        hot: true,
        historyApiFallback: true,
        inline: true,
        progress: true,
        port,
        proxy: [{
            context: [
                '/api',
            ],
            target: '',
            secure: false
        }, {
            context: [
                '/websocket'
            ],
            target: 'ws://127.0.0.1:8080',
            ws: true
        }]
    },
    module:{
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(css|less)$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
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
                                    javascriptEnabled: true,
                                    modifyVars: customizeTheme
                                },
                            },
                        ],
                    },
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
        new webpack.NamedModulesPlugin(),
        // only development
        // Hot Module Replacement(HMR), in most cases no options are necessary.
        // @see: https://webpack.js.org/plugins/hot-module-replacement-plugin/
        new webpack.HotModuleReplacementPlugin(),

        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: true,
        }),
    ]
}

module.exports = WebpackMerge(commonConfig, config);
