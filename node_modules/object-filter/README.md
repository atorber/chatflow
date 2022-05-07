# objfilter
[![Build Status](https://travis-ci.org/mmalecki/objfilter.png?branch=master)](https://travis-ci.org/mmalecki/objfilter)

`Array.prototype.filter` for objects.

## Usage

```js
var assert = require('assert');
var objfilter = require('../');

var o1 = {
  a: 1,
  b: -1,
  c: 0,
  d: 42
};

objfilter(o1, function (n) {
  return n > 0;
}); // => `{ a: 1, d: 42 }`
```

## API

### `objfilter(obj, iterator, this)`

* `obj` (`object`) - object to filter on
* `iterator` (`function`, required) - iterator function
* `this` (optional) - `this` for `iterator`

Creates a new object with all the elements that pass the test implemented by
`iterator`.
