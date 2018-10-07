
var path = require('path');
var webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const config = {
  mode: 'development',
  entry: path.resolve(__dirname,'./public/src/main.js'),
    output: {
      path: path.resolve(__dirname, './public/build/'),
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        vue: './vue.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        }, {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    devServer: {
      port: 3030,
      hot: true
    },
    plugins: [
      // make sure to include the plugin for the magic
      new VueLoaderPlugin()
    ]

};

module.exports = config;


