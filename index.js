'use strict';

var fs      = require('fs');
var utils   = require('loader-utils');
var compile = require('node-elm-compiler').compile;

var extend = function (obj) {
  var source, prop, i, l;
  for (i = 1, l = arguments.length; i < l; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
};


var loadConfig = function (source, callback) {
  // Default config.
  var config = {
    output: 'tmp/[name].js'
  };

  // Copy options to own object.
  var options = this.options.ulmus;
  extend(config, options);

  // Copy query to own object.
  var query = utils.parseQuery(this.query);
  extend(config, query);

  // Select emitter.
  var emitter = config.emitErrors ? this.emitError.bind(this) : this.emitWarning.bind(this);
  delete config.emitErrors;

  // Interpolate output filename.
  var output = utils.interpolateName(this, config.output, {
    context: query.context || this.options.context,
    content: source,
    regExp:  query.regExp
  });

  extend(config, {
    warn: emitter,
    output: output,
    yes: true
  });

  callback(null, config);
};

var compileResource = function (resource, config, callback) {
  try {
    compile(resource, config).on('close', function (exitCode) {
      if (exitCode === 0) {
        fs.readFile(config.output, 'utf8', callback);
      }
      else {
        callback('Compiler process exited with code ' + exitCode + '.');
      }
    });
  }
  catch (err) {
    callback('Compiler process generated an exception: ' + err);
  }
};


module.exports = function (source) {
  this.cacheable();

  var callback = this.async();

  if (!callback) {
    throw 'ulmus-loader only supports async mode.';
  }

  loadConfig.call(this, source, function (err, config) {
    if (err) {
      return callback(err);
    }

    this.addDependency(this.resourcePath);

    compileResource.call(this, this.resourcePath, config, function (err, source) {
      if (err) {
        return callback(err);
      }

      callback(null, source);
    }.bind(this));
  }.bind(this));
};
