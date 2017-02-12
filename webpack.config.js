const webpack = require('webpack');
const path = require('path');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const srcPath = path.join(__dirname, "./src");
const distPath = path.join(__dirname, "./dist");
const assetsPath = path.join(__dirname, "./assets");

module.exports = {
    context: __dirname,
    target: 'web',
    entry: {
        'main': './src/index.tsx',
        'vendor': ['react', 'redux', 'rxjs', 'd3']
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js',
        publicPath: '/dist/'
    },
    performance: {
        hints: false
    },
    devtool: 'source-map',
    resolve: {
        modules: [
            "node_modules",
            srcPath
        ],
        extensions: [
            '.ts', '.tsx',
            '.js', '.jsx',
        ],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'ts-loader'
                ]
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            fileName: 'vendor.bundle.js',
            minChunks: Infinity
        }),
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true,
        //     debug: false
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         screw_ie8: true,
        //         conditionals: true,
        //         unused: true,
        //         comparisons: true,
        //         sequences: true,
        //         dead_code: true,
        //         evaluate: true,
        //         if_return: true,
        //         join_vars: true,
        //     },
        //     output: {
        //         comments: false
        //     },
        // })
    ],
    devServer: {
        compress: isProd,
        port: 9090,
        historyApiFallback: {
            index:'index.html'
        },
        publicPath: '/dist/',
        inline: true
    }
}
