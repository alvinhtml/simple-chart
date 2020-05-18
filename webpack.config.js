const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        simplechart: ['./app/tools/hidpi-canvas.js', './app/minichart.js'],
        index: './app/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html'
        })
    ],
    devServer: {
        port: 8080,
        progress: true,
        contentBase: './build',
        open: true,
        //hot: true,
        proxy: {
            '/mui/src/css': {
                target: 'http://project.xuehtml.com',
                changeOrigin: true
            }
        },
    }
}
