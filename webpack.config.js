const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = (env, options) => {
  const inProduction = options.mode === 'production';

  return {
    devServer: {
      contentBase: './dist',
      hot: true,
      // inline: true
    },
    entry: './src/index.js',
    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['babel-preset-env']
            }
          }
        },
        {
          test: /\.scss$/,
          use: inProduction
            ? ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                  // 'css-loader?url=false',
                  {
                    loader: 'css-loader',
                    options: {
                      url: false,
                      minimize: true,
                    }
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            autoprefixer({
                                browsers:['ie >= 10', 'last 4 version']
                            })
                        ],
                        sourceMap: true
                    }
                  },
                  'sass-loader'
                ]
              })
            : ['style-loader', 'css-loader?url=false', 'sass-loader']
        }
      ]
    },
    plugins: inProduction
      ? [ new ExtractTextPlugin({ filename: 'css/style.css' }) ]
      : [ new webpack.HotModuleReplacementPlugin() ],
  }
};