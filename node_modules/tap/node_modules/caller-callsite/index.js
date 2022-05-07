'use strict';
const callsites = require('callsites');

module.exports = ({depth = 0} = {}) => {
	const callers = [];
	const callerFileSet = new Set();

	for (const callsite of callsites()) {
		const fileName = callsite.getFileName();
		const hasReceiver = callsite.getTypeName() !== null && fileName !== null;

		if (!callerFileSet.has(fileName)) {
			callerFileSet.add(fileName);
			callers.unshift(callsite);
		}

		if (hasReceiver) {
			return callers[depth];
		}
	}
};
