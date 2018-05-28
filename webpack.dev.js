var webpack = require('webpack');
var path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const entryPath = path.join(__dirname, './src');

const outputPath = path.join(__dirname, './dist');

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
    output: {
        // Next line is not used in dev but WebpackDevServer crashes without it:
        path: outputPath,
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: '[name].[hash].bundle.js',

        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: '[name].[hash].chunk.js',
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
            target: 'http://localhost:8080',
            secure: false
        }, {
            context: [
                '/websocket'
            ],
            target: 'ws://127.0.0.1:8080',
            ws: true
        }]
    },
    resolve: {
        alias: {
            // 全局色彩使用统一变量
            'img': path.resolve('public/img/'),
        }
    },
    module:{
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                exclude: [/node_modules/, /lib/],
                use: [{
                    loader: 'eslint-loader',
                }],
            },
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: [/node_modules/, /lib/],
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    },
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
                                    // modifyVars: customizeTheme
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'file-loader',
                        options: {
                            name: './fonts/[name].[ext]'
                        }
                    },
                    {
                        test: /\.(png|jpg|gif)$/, use: { loader: 'file-loader', options: { limit: 8192, name: './[name].[ext]' } }
                    }
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

        new webpack.ProvidePlugin({}),

        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: true,
        }),

        /**
         * https://github.com/Urthen/case-sensitive-paths-webpack-plugin
         */
        new CaseSensitivePathsPlugin(),
    ]
}

module.exports = config;