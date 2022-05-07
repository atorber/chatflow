"use strict";

var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function(obj, map) {
	var result = {};
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			result[key] = map(obj[key], key, obj);
		}
	}
	return result;
};
