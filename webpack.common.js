var path = require('path');

const entryPath = path.join(__dirname, './src');

const outputPath = path.join(__dirname, './dist');

const commonConfig = {
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
    resolve: {
        alias: {
            // 目录统一变量
            'img': path.resolve('public/img/'),
            'components': path.resolve('src/components/'),
        }
    },
    module: {
        rules: [
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
                        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]'
                        }
                    },
                    {
                        test: /\.(png|jpg|gif)$/, use: { loader: 'file-loader', options: { limit: 8192, name: 'img/[name].[ext]' } }
                    }
                ]
            }
        ]
    },
}

module.exports = commonConfig;
