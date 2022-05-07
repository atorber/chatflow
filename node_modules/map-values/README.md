# map-values

Map object values returning a new object.

# Example
```js
var map = require("map-values");
map({ foo: 2 }, function(val, key, obj) {
  return val * 2;
});
// -> { foo: 4 }
```

# Installation
```
npm install map-values
```
