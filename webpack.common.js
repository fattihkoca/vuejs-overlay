const path = require('path');
const webpack = require('webpack');
const npmCfg = require('./package.json');
const projectRoot = path.resolve(__dirname, './');

const {VueLoaderPlugin} = require('vue-loader');

const banner = [
    'vuejs-overlay v' + npmCfg.version,
    '(c) ' + (new Date().getFullYear()) + ' ' + npmCfg.author,
    npmCfg.homepage
].join('\n');

module.exports = {
    entry: ['./src'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'vuejs-overlay.js',
        library: 'VueOverlay',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        modules: [
            path.join(__dirname, 'node_modules')
        ],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
        }
    },
    resolveLoader: {
        modules: [
            path.join(__dirname, 'node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            /*{
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage'
                        }]
                    ],
                    comments: false
                },
                include: projectRoot,
                exclude: /node_modules/
            },*/
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new VueLoaderPlugin()
    ]
}