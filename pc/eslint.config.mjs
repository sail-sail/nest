import eslint from "@eslint/js";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";
import vueMacros from "@vue-macros/eslint-config";

export default typescriptEslint.config(
  vueMacros,
  {
    ignores: [
      "src/typings/**",
      "src/assets/**",
      "src/typings/**",
      "*.d.ts",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": 0,
      "vue/prop-name-casing": 0,
      "vue/html-self-closing": 0,
      "vue/multi-word-component-names": 0,
      "vue/multiline-html-element-content-newline": 0,
      "vue/html-indent": [
        "error",
        2,
        {
          "attribute": 1,
          "baseIndent": 0,
          "closeBracket": 0,
          "alignAttributesVertically": true,
          "ignores": []
        },
      ],
      "vue/no-dupe-keys": 0,
    },
  },
);
