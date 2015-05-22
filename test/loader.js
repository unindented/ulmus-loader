var fs = require('fs');
var path = require('path');
var loader = require('../index.js');

var source = path.join(__dirname, './fixtures/Foo.elm');
var expected = fs.readFileSync(path.join(__dirname, './expected/Foo.js'), 'utf-8');

var toString = Object.prototype.toString;

var isArray = function (obj) {
  return toString.call(obj) === '[object Array]';
};

var mock = function (query, opts, callback) {
  var emittedError;
  var emittedWarning;

  var result = {
    resourcePath: source,

    async: function () { return callback; },

    emitError: function (err) { emittedError = err; },
    emittedError: function () { return emittedError; },
    emitWarning: function (warn) { emittedWarning = warn; },
    emittedWarning: function () { return emittedWarning; },

    addDependency: function () {},
    cacheable: function () {},

    options: {}
  };

  if (query) {
    result.query = '?' + (isArray(query) ? query.join('&') : query);
  }

  if (opts) {
    result.options.ulmus = opts;
  }

  return result;
};

module.exports.test = {
  'sync mode': {
    'throws': function (test) {
      var context = mock();

      try {
        loader.call(context, source);
      }
      catch (err) {
        test.done();
      }
    }
  },

  'async mode': {
    'compiles the resource': function (test) {
      var context;

      var callback = function (err, result) {
        test.equal(null, err);
        test.equal(result, expected);
        test.done();
      };

      context = mock(null, null, callback);
      loader.call(context, source);
    },

    'emits warnings': function (test) {
      var context;

      var callback = function () {
        test.equal(undefined, context.emittedWarning());
        test.done();
      };

      context = mock(null, null, callback);
      loader.call(context, source);
    },

    'overrides parameters from query': function (test) {
      var context;

      var callback = function () {
        test.ok(fs.lstatSync('tmp/Bar.js').isFile());
        test.done();
      };

      context = mock('output=tmp/Bar.js', null, callback);
      loader.call(context, source);
    },

    'overrides parameters from options': function (test) {
      var context;

      var callback = function () {
        test.ok(fs.lstatSync('tmp/Baz.js').isFile());
        test.done();
      };

      context = mock(null, {output: 'tmp/Baz.js'}, callback);
      loader.call(context, source);
    },

    'can emit errors instead of warnings': function (test) {
      var context;

      var callback = function () {
        test.equal(undefined, context.emittedError());
        test.done();
      };

      context = mock(null, {emitErrors: true}, callback);
      loader.call(context, source);
    }
  }

};
