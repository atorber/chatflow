const ESLINT_RULES = {
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-misused-promises': 'error',
  '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
  '@typescript-eslint/no-useless-constructor': 'off',
  'brace-style': ['error', '1tbs', { allowSingleLine: true }],
  'comma-dangle': ['error', 'always-multiline'],
  'dot-notation': ['off'],
  'import/extensions': ['error', 'ignorePackages'],
  'key-spacing': 'off',
  'multiline-ternary': 'off',
  'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
  'no-dupe-class-members': 'off',
  'no-multi-spaces': 'off',
  'no-unused-vars': 'off',
  'no-useless-constructor': 'off',
  'no-void': ['error', { allowAsStatement: true }],
  'operator-linebreak': ['error', 'before'],
  'padded-blocks': ['error', { classes: 'always' }],
  'sort-keys': 'error',
}

module.exports = {
  ESLINT_RULES,
}
