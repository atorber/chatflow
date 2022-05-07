nop
===

a library for providing a javascript function that does nothing; it's like super useful

[![Build Status](https://secure.travis-ci.org/supershabam/nop.png?branch=master)](http://travis-ci.org/supershabam/nop)

[![endorse](http://api.coderwall.com/supershabam/endorsecount.png)](http://coderwall.com/supershabam)

use case
--------
Did you know every time you create a do-nothing no-op function you're consuming 
memory? You can literally save maybe a whole byte or two by using this nop library.

Anybody who cares about being efficient and doesn't care about being rediculous should use this library.

examples
-------

### default callback
```javascript
var nop = require('nop');

function example(options) {
  options = options || {};
  options.success = options.success || nop;
  options.error = options.error || nop;

  // do stuff
  options.success();
}
```

### feel like calling a function, but don't want it to do anything and don't want to create it myself
```javascript
var nop = require('nop');

var a = 'a';
var b = 'b';
// do you think I should call a function now?
var c = 'c';
// nah, I'll wait
var d = 'd';
var e = 'e';
var f = 'f';
// maybe now
nop();
var g = 'g';
// can I do another?
var h = 'h';
var j = 'j';
// sure... I guess
nop();
nop();
// hey, you were supposed to just do one
var i = 'i';
// sorry
var j = 'j';
// alright, then, as long as you're sorry
var k = 'ok';
```
