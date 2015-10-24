var path = require('path');


module.exports = {
  entry: './app/index',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    contentBase: 'app'
  }
};
