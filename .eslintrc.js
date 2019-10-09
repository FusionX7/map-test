module.exports = {
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier', 'react-hooks'],
  env: {
    browser: true,
    jasmine: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-closing-bracket-location': [
      1,
      { selfClosing: 'line-aligned', nonEmpty: 'after-props' },
    ],
    'react/destructuring-assignment': 1,
    'react/jsx-props-no-spreading': 1,
    '@typescript-eslint/camelcase': 0,
    'no-plusplus': 0,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
};
