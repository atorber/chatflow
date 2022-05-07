module.exports = function objfilter(o, f, t) {
  if (typeof f !== 'function') {
    throw new TypeError('`f` has to be a function');
  }

  var ret = {};
  Object.keys(o).forEach(function (k) {
    if (f.call(t || this, o[k], k, o)) {
      ret[k] = o[k];
    }
  });
  return ret;
};
