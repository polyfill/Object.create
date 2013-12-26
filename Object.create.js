/*
  Polyfill Object.create
*/

if (typeof Object.create === 'undefined') {
  Object.create = function (object) {
    if (arguments.length !== 1) {
      throw new Error('Object.crete polyfill only accept one parameter');
    }

    function fn() {}
    fn.prototype = object;
    fn.prototype.constructor = object.constructor;
    return new fn;
  }
};
