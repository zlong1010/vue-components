module.exports = {
  extends: ["standard"],
  env: {
    "browser": true,
    "amd": true
  },
  globals: {
    "it": "readonly",
    "expect": "readonly",
    "describe": "readonly",
    'xb': 'writable',
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    parser: 'babel-eslint',
  },
  //
  root: true,
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': 'off',
    'prefer-promise-reject-errors': 'off',
    'max-len': ['error', { 'code': 500 }],
    'no-unused-expressions': 'off',
    'func-names': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'no-continue': 'off',
    'no-iterator': 'off',
    'no-plusplus': 'off',
    'linebreak-style': 'off',
    'no-param-reassign': 'off',
    'arrow-parens': 'off',
    'object-curly-newline': 'off',
    'quote-props': 'off',
    'no-underscore-dangle': 0, // 允许下划线开头结尾
    'consistent-return': 'off',
    'semi': ['error', "always"],
    "comma-dangle": 0,
    'space-before-function-paren': ['error', 'never'],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ]
}
