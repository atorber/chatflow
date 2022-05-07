'use strict';
const callerCallsite = require('caller-callsite');

module.exports = ({depth = 0} = {}) => {
	const callsite = callerCallsite({depth});
	return callsite && callsite.getFileName();
};
