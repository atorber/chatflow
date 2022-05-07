var semver = require('semver');

var current = process.version;
var supported = require('./package.json').engines.node;

if (!semver.satisfies(current, supported)) {
  console.error(
    '\n' +
    'You are using node version ' + semver.valid(current) + '.\n\n' +
    'check-node-version supports node verion ' + semver.valid(semver.minVersion(supported)) + ' and newer.\n\n' +
    'Please do one of the following:\n' +
    '  1. update your version of node\n' +
    '  2. downgrade to version 3.3.0 of check-node-version\n\n' +
    'We are sorry for the inconvenience.' +
    '\n'
  );

  process.exit(1);
}
