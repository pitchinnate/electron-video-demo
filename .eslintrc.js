module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    '@vue/typescript/recommended'
  ],

  rules: {
    'comma-dangle': ['warn', 'never'],
    'no-console': 'warn',
    'no-debugger': 'warn',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
    '@typescript-eslint/no-namespace': ['off'],
    '@typescript-eslint/ban-ts-ignore': 'error',
    'prettier/prettier': 'off'
  },

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  plugins: ['prettier']
};
