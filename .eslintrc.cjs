const rules = {
  'multiline-ternary': 'off',
}

module.exports = {
  extends: '@chatie',
  parserOptions: {
    project: './tsconfig.json', // 更改为正确的路径
  },
  rules,
}
