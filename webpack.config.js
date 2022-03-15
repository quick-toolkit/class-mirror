const path = require('path');
module.exports = {
  entry: {
    index: path.resolve('dist', "cjs", 'index.js')
  },
  mode: 'production',
  output: {
    path: path.resolve('dist', "umd"),
    filename: "[name].js",
    library: {
      type: 'umd2',
      name: 'ClassMirror',
    }
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }
    ]
  },
  target: ["web", "es5"]
};
