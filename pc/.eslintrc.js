module.exports = {
  root: true,
  env: { node: true },
  // https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    // https://github.com/vuejs/eslint-plugin-vue/blob/44ff0e02cd0fd08b8cd7dee0127dbb5590446323/docs/user-guide/README.md#conflict-with-prettier
    "plugin:vue/vue3-recommended",
    "./.eslintrc-auto-import.json",
  ],
  rules: {
    "vue/multi-word-component-names": [ 0 ],
    "vue/html-indent": [ 0 ],
    "vue/html-self-closing": [ 0 ],
    "vue/multiline-html-element-content-newline": [ 0 ],
    "vue/prop-name-casing": [ 0 ],
    "@typescript-eslint/no-explicit-any": [ 0 ],
    "@typescript-eslint/no-unused-vars": [ 0 ],
    "@typescript-eslint/no-empty-function": [ 0 ],
    "vue/no-template-shadow": [ 0 ],
    "@typescript-eslint/no-non-null-assertion": [ 0 ],
    "@typescript-eslint/no-empty-interface": [ 0 ],
    "prefer-const": [ 0 ],
    "@typescript-eslint/ban-types": [ 0 ],
    "vue/html-closing-bracket-newline": [ 0 ],
    "vue/attributes-order": [ 0 ],
    "vue/valid-v-model": [ 0 ],
  },
};
