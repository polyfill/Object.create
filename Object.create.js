/*
  Polyfill Object.create
*/

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    if (arguments.length !== 1) {
      throw new Error('Object.create polyfill only accepts one parameter');
    }

    function F() {}
    F.prototype = o;

    return new F();
  };
}
