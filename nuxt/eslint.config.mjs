// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
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
