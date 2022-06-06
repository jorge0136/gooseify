module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "jest/globals": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:jest/recommended"],
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": ["jest"],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      "never"
    ],
  }
};
