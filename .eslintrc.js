module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['@repo/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-redeclare': 'off',
    'turbo/no-undeclared-env-vars': 'off',
  },
};
