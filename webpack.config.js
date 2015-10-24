var path = require('path');


module.exports = {
  entry: './app/index',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.html$/, loaders: ['raw'] }
    ]
  },
  devServer: {
    contentBase: 'app'
  }
};
