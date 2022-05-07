"use strict";

var test = require("tape");
var assert = require("assert");
var map = require("./");

test("should map object", function(t) {
	var obj = map({ foo: 2, bar: 5 }, function(val) {
		return val * 2;
	});
	assert(Object.keys(obj).length === 2);
	assert(obj.foo === 4);
	assert(obj.bar === 10);
});
