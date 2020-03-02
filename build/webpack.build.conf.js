var path = require('path');
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var pkg = require('../package.json')

var comments = `${pkg.name}
version: ${pkg.version}
author: ${pkg.author}
light weight ripple library`

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'lipper.min.js',
    library: 'lipper',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(comments),
    new UglifyJsPlugin()
  ]
});
