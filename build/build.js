
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("shallker-color-console/component.js", Function("exports, require, module",
"module.exports = require('./lib/browser-console');\n\
//@ sourceURL=shallker-color-console/component.js"
));
require.register("shallker-color-console/lib/browser-console.js", Function("exports, require, module",
"/**\n\
 * Print colorful console text in browser\n\
 */\n\
exports.black = function (text) {\n\
  console.log('%c' + text, 'color: black;');\n\
}\n\
\n\
exports.red = function (text) {\n\
  console.log('%c' + text, 'color: red;');\n\
}\n\
\n\
exports.green = function (text) {\n\
  console.log('%c' + text, 'color: green;');\n\
}\n\
\n\
exports.yellow = function (text) {\n\
  console.log('%c' + text, 'color: yellow;');\n\
}\n\
\n\
exports.blue = function (text) {\n\
  console.log('%c' + text, 'color: blue;');\n\
}\n\
\n\
exports.magenta = function (text) {\n\
  console.log('%c' + text, 'color: magenta;');\n\
}\n\
\n\
exports.cyan = function (text) {\n\
  console.log('%c' + text, 'color: cyan;');\n\
}\n\
\n\
exports.white = function (text) {\n\
  console.log('%c' + text, 'color: white;');\n\
}\n\
\n\
exports.grey = function (text) {\n\
  console.log('%c' + text, 'color: grey;');\n\
}\n\
//@ sourceURL=shallker-color-console/lib/browser-console.js"
));
require.register("shallker-simple-test/component.js", Function("exports, require, module",
"module.exports = require('./lib/simple-test');\n\
//@ sourceURL=shallker-simple-test/component.js"
));
require.register("shallker-simple-test/lib/simple-test.js", Function("exports, require, module",
"var yellow = require('color-console').yellow;\n\
var green = require('color-console').green;\n\
var grey = require('color-console').grey;\n\
var red = require('color-console').red;\n\
\n\
function success(name) {\n\
  green(name + ' ... ok');\n\
}\n\
\n\
function fail(name) {\n\
  red(name + ' ... not ok');\n\
}\n\
\n\
var test = function (name, fn) {\n\
  if (~fn.toString().indexOf('(done')) return test.async(name, fn);\n\
\n\
  try {\n\
    fn();\n\
    success(name);\n\
  } catch (e) {\n\
    fail(name);\n\
    if (e === null) e = {stack: ''};\n\
    if (typeof e === 'undefined') e = {stack: ''};\n\
    if (typeof e === 'string') e = {stack: e};\n\
    grey(e.stack);\n\
  }\n\
}\n\
\n\
test.async = function (name, fn) {\n\
  var wait = 1000;\n\
\n\
  function done() {\n\
    clearTimeout(timeout);\n\
    success(name);\n\
  }\n\
\n\
  try {\n\
    fn(done);\n\
  } catch (e) {\n\
    clearTimeout(timeout);\n\
    fail(name);\n\
    grey(e.stack);\n\
  }\n\
\n\
  var timeout = setTimeout(function () {\n\
    yellow(name + ' ... exceed ' + wait + ' milliseconds');\n\
  }, wait);\n\
}\n\
\n\
exports = module.exports = test;\n\
\n\
exports.equal = function (a, b) {\n\
  if (a !== b) throw new Error(a + ' not equal ' + b);\n\
}\n\
\n\
/**\n\
 * Alias of equal\n\
 */\n\
exports.eq = exports.equal;\n\
\n\
exports.notEqual = function (a, b) {\n\
  if (a === b) throw new Error(a + ' equal ' + b);\n\
}\n\
\n\
/**\n\
 * Alias of notEqual\n\
 */\n\
exports.notEq = exports.notEqual;\n\
\n\
exports.ok = function (result) {\n\
  if (!result) throw new Error(result + ' is not ok');\n\
}\n\
\n\
exports.notOk = function (result) {\n\
  if (result) throw new Error(result + ' is ok');\n\
}\n\
\n\
exports.throws = function (fn) {\n\
  try {\n\
    fn();\n\
  } catch (e) {\n\
    return 'complete';\n\
  }\n\
\n\
  throw new Error(fn.toString() + ' did not throw');\n\
}\n\
\n\
exports.notThrows = function (fn) {\n\
  try {\n\
    fn();\n\
  } catch (e) {\n\
    throw new Error(fn.toString() + ' throwed');\n\
  }\n\
}\n\
//@ sourceURL=shallker-simple-test/lib/simple-test.js"
));
require.register("Object.create/index.js", Function("exports, require, module",
"module.exports = require('./Object.create');\n\
//@ sourceURL=Object.create/index.js"
));
require.register("Object.create/Object.create.js", Function("exports, require, module",
"/*\n\
  Polyfill Object.create\n\
*/\n\
\n\
if (typeof Object.create === 'undefined') {\n\
  Object.create = function (object) {\n\
    if (arguments.length !== 1) {\n\
      throw new Error('Object.crete polyfill only accept one parameter');\n\
    }\n\
\n\
    function fn() {}\n\
    fn.prototype = object;\n\
    fn.prototype.constructor = object.constructor;\n\
    return new fn;\n\
  }\n\
};\n\
//@ sourceURL=Object.create/Object.create.js"
));
require.alias("shallker-simple-test/component.js", "Object.create/deps/simple-test/component.js");
require.alias("shallker-simple-test/lib/simple-test.js", "Object.create/deps/simple-test/lib/simple-test.js");
require.alias("shallker-simple-test/component.js", "Object.create/deps/simple-test/index.js");
require.alias("shallker-simple-test/component.js", "simple-test/index.js");
require.alias("shallker-color-console/component.js", "shallker-simple-test/deps/color-console/component.js");
require.alias("shallker-color-console/lib/browser-console.js", "shallker-simple-test/deps/color-console/lib/browser-console.js");
require.alias("shallker-color-console/component.js", "shallker-simple-test/deps/color-console/index.js");
require.alias("shallker-color-console/component.js", "shallker-color-console/index.js");
require.alias("shallker-simple-test/component.js", "shallker-simple-test/index.js");
require.alias("Object.create/index.js", "Object.create/index.js");