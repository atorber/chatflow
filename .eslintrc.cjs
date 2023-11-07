const rules = {
  'multiline-ternary': 'off',
  'sort-keys': 'off',
  'no-use-before-define': 'off', // 允许在类、函数和变量定义之前使用它们
}

module.exports = {
  extends: '@chatie',
  parserOptions: {
    project: './tsconfig.json', // 更改为正确的路径
  },
  rules,
}
