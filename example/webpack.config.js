var path = require('path');

module.exports = {
  entry: './Entry.elm',

  output: {
    path: path.join(__dirname, 'out'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.elm$/,
        loader: 'expose?Elm!exports?Elm!' + path.join(__dirname, '..')
      }
    ]
  },

  ulmus: {
    output: 'tmp/[name].[md5:hash:hex:32].js'
  }
};
