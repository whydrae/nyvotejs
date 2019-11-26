module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:node/recommended"],
  plugins: ["html"],
  globals: {
    angular: true
  },
  parserOptions: {
    sourceType: "module"
  }
};
