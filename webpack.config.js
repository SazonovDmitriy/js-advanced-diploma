const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      }
    },
    {
      test: /\.html$/i,
      use: [
        'html-loader'
      ]
    },
    {
      test: /\.css$/i,
      use: [
        'css-loader'
      ]
    },
    {
      test: /\.svg$/i,
      use: [
        'svgo-loader',
        'url-loader'
      ]
    },
    {
      test: /\.png$/i,
      use: [
        'url-loader'
      ]
    },
    ],
  }
}