module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    "airbnb"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    },
    "propWrapperFunctions": ["forbidExtraProps"]
  },
  rules: {
    "no-unused-vars": 1,
    "quotes": [2, "double", { allowTemplateLiterals: true }],
    "complexity": [1, 5],
    "comma-dangle": 0,
    "indent": [2, 2, { SwitchCase: 1, },],
    "arrow-body-style": 0
  }
};
