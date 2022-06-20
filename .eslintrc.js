module.exports = {
  extends: ["airbnb", "react-app", "react-app/jest", "plugin:import/typescript", "prettier"],
  plugins: ["react", "prettier"],
  settings: {
    propWrapperFunctions: ["forbidExtraProps"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    },
    react: {
      version: "999.999.999"
    }
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    quotes: [2, "double", { allowTemplateLiterals: true }],
    complexity: [2, 5],
    "comma-dangle": 0,
    indent: "off",
    "@typescript-eslint/indent": ["error", 2, { SwitchCase: 1 }],
    "arrow-body-style": 0,
    "prefer-arrow-callback": 0,
    "no-console": 0,
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    "react/jsx-wrap-multilines": ["error", { declaration: false, assignment: false }],
    "react/forbid-prop-types": 1,
    "prettier/prettier": [
      "error",
      {
        printWidth: 100,
        arrowParens: "always",
        trailingComma: "none"
      }
    ]
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "react/prop-types": "off"
      }
    }
  ]
};
