module.exports = {
  extends: [
    "airbnb",
    "react-app",
    "plugin:import/typescript",
    "prettier"
  ],
  plugins: [
    "react",
    "prettier"
  ],
  settings: {
    "propWrapperFunctions": ["forbidExtraProps"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    },
    "react": {
      version: "999.999.999"
    }
  },
  rules: {
    "no-unused-vars": 1,
    "quotes": [2, "double", { "allowTemplateLiterals": true }],
    "complexity": [2, 5],
    "comma-dangle": 0,
    "indent": [2, 2, { "SwitchCase": 1 }],
    "arrow-body-style": 0,
    "no-console": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".jsx", ".tsx"] }],
    "react/jsx-wrap-multilines": ["error", {"declaration": false, "assignment": false}],
    "prettier/prettier": [2, {
      "printWidth": 100,
      "arrowParens": "always"
    }]
  },
  overrides: [
    {
      "files": ["**/*.tsx"],
      "rules": {
          "react/prop-types": "off"
      }
    }
  ]
}