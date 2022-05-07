
var GitScripts = require('./git-scripts');


module.exports = function(path) {
  return new GitScripts(path);
};
