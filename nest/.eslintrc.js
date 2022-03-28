module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    "quotes": [ 0 ],
    "max-len": [ 0 ],
    "no-trailing-spaces": [ 0 ],
    "array-bracket-spacing": [ 0 ],
    "object-curly-spacing": [ 0 ],
    "no-unused-vars": [ 0 ],
    "require-jsdoc": [ 0 ],
    "indent": ["error", 2],
    "camelcase": [ 0 ],
    "spaced-comment": [ 0 ],
    "linebreak-style": [ 0 ],
    "no-throw-literal": [ 0 ],
    "valid-jsdoc": [ 0 ],
    "padded-blocks": [ 0 ],
    "new-cap": [ 0 ],
    "prefer-const": [ 0 ],
    "prefer-rest-params": [ 0 ],
    "operator-linebreak": [ 0 ],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "never",
    }],
  },
};
