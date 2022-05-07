const TSLINT_CONFIG = {
  rules: {
    // tslint rules (will be used if `lintFile` is not specified)
    'arrow-parens': false,
    'comment-format': false,
    'import-spacing': false,
    'interface-name': [true, 'never-prefix'],
    'max-line-length': false,
    'member-ordering': false,
    'no-console': false,
    'no-multi-spaces': false,
    'no-promise-as-boolean': true,
    'space-within-parens': false,
    'ter-indent': false,
    'trailing-comma': true,
    'typedef-whitespace': false,
    'unified-signatures': false,
  },
  rulesDirectory: [
    // array of paths to directories with rules, e.g. 'node_modules/tslint/lib/rules' (will be used if `lintFile` is not specified)
    // 'node_modules/@wwwouter/tslint-contrib',
  ],
}

module.exports = {
  TSLINT_CONFIG,
}
