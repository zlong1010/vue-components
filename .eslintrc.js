module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': 0, // 允许下划线开头结尾
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    camelcase: 0,
    'no-var': 2, // 禁用var
    'no-unused-vars': [2, { args: 'none' }], // 消除未使用的变量  不检查函数的参数
    'no-redeclare': 2, // 禁止多次声明同一变量
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复
    eqeqeq: ['error', 'always', { null: 'ignore' }] // 强制使用全等
  },
};
