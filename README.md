# Elm loader for webpack [![Version](https://img.shields.io/npm/v/ulmus-loader.svg)](https://www.npmjs.com/package/ulmus-loader) [![Build Status](https://img.shields.io/travis/unindented/ulmus-loader.svg)](http://travis-ci.org/unindented/ulmus-loader) ![Abandoned](https://img.shields.io/badge/status-abandoned-red.svg)

Compile Elm files using the awesome [node-elm-compiler](https://github.com/rtfeldman/node-elm-compiler).

**Note**: This project has been superseded by [`elm-webpack-loader`](https://github.com/rtfeldman/elm-webpack-loader).


## Installation

```sh
$ npm install --save ulmus-loader
```


## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

In your `webpack.config.js` file:

```js
module.exports = {
  module: {
    preLoaders: [{
      test:    /\.elm$/,
      exclude: /node_modules/,
      loader: 'expose?Elm!exports?Elm!ulmus?output=tmp/[name].js'
    }]
  },

  ulmus: {
    // You can also specify the output name or pattern here.
    output: 'tmp/[name].js',

    // Set `emitErrors` to `true` to display warnings as errors.
    emitErrors: true
  }
};
```


## Filename templates

You can configure a custom filename template for your file using the query
parameter `output`. For instance, to copy a file from your `context` directory
into the output directory retaining the full directory structure, you might
use `?output=[path][name].js` in the query, or add this to your options:

```js
ulmus: {
  output: 'tmp/[path][name].js'
}
```

The default is `tmp/[name].js`.


### Filename template placeholders

* `[ext]` the extension of the resource
* `[name]` the basename of the resource
* `[path]` the path of the resource relative to the `context` query parameter or option.
* `[hash]` the hash or the content
* `[<hashType>:hash:<digestType>:<length>]` optionally you can configure
  * other `hashType`s, i. e. `sha1`, `md5`, `sha256`, `sha512`
  * other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length` the length in chars
* `[N]` the N-th match obtained from matching the current file name against the query param `regExp`


## Meta

* Code: `git clone git://github.com/unindented/ulmus-loader.git`
* Home: <https://github.com/unindented/ulmus-loader/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2015 Daniel Perez Alvarez ([unindented.org](http://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
