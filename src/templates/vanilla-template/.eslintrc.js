module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["plugin:prettier/recommended", "eslint-config-prettier", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    indent: ["warn", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "prettier/prettier": 0,
    "react/jsx-first-prop-new-line": [1, "multiline"],
    "react/jsx-indent-props": [2, 2],
    "react/jsx-max-props-per-line": [
      1,
      {
        maximum: 1,
      },
    ],
  },
  plugins: ["prettier", "react"],
};
