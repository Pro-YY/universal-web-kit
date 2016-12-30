'use strict'
/*
 * no es6 syntax here, like import path from 'path'
 * ./node_modules/.bin/webpack --config tools/webpack.config.js
 */
const webpack = require('webpack')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const SOURCE_ROOT = path.resolve(PROJECT_ROOT, 'source')
const BUILD_ROOT = path.resolve(PROJECT_ROOT, 'build')

const sharedConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          SOURCE_ROOT,
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['latest', 'react', 'stage-0'],
              plugins: [
                ['transform-runtime', {
                  'helpers': true,
                  'polyfill': true,
                  'regenerator': true,
                  'moduleName': 'babel-runtime',
                }]
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'isomorphic-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              'modules': true,  // local scope by default
              'localIdentName': '[name]_[local]_[hash:base64:3]',
              'minimize': true,
            },
          }
        ],
      },
    ],
  },
  resolve: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.css' ],
  },
}

const serverConfig = Object.assign({}, sharedConfig, {
  target: 'node',
  entry: {
    main: ['babel-polyfill', path.resolve(SOURCE_ROOT, 'server', 'main.js')],
  },
  output: {
    path: BUILD_ROOT,
    filename: 'server.[name].bundle.js',
    libraryTarget: 'commonjs2',   // need if with externals assets
  },
  externals: [
    /^\.\/assets$/,     // for client js
  ],
  plugins: [
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin, conditional transpiling
    new webpack.DefinePlugin({
      'DEFINE_BROWSER': false,
    }),
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,   // keep as it is, or in commonjs2 it changes to '/'
    setImmediate: false,
  },
  devtool: 'source-map',
})

const clientConfig = Object.assign({}, sharedConfig, {
  target: 'web',
  entry: {
    main: ['babel-polyfill', path.resolve(SOURCE_ROOT, 'client', 'main.js')],
  },
  output: {
    path: path.resolve(BUILD_ROOT, 'public', 'assets'),
    publicPath: '/assets/',   // needed by AssetsPlugin
    filename: 'client.[name].[hash].bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'DEFINE_BROWSER': true,
    }),
    new AssetsPlugin({
      path: path.resolve(BUILD_ROOT),   // besides server entry
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`, // so import by server
    }),
  ],
  devtool: 'source-map',
})

const targets = [
  serverConfig,
  clientConfig,
]

module.exports = targets
