import {
  promises as fs,
} from "node:fs";

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

import {
  presetApplet,
  presetRemRpx,
  transformerApplet,
  transformerAttributify,
} from "unocss-applet";

const isH5 = process.env.UNI_PLATFORM === "h5";

const presets = [
  presetIcons({
    prefix: "n-i-",
    scale: 1.2,
    warn: true,
    extraProperties: {
      "display": "inline-block",
      "vertical-align": "middle",
    },
    collections: {
      iconfont: async (iconName) => await fs.readFile(`./src/assets/iconfont/${ iconName }.svg`, "utf8"),
    },
  }),
  /**
   * you can add `presetAttributify()` here to enable unocss attributify mode prompt
   * although preset is not working for applet, but will generate useless css
   */
  presetApplet({
    prefix: "n-",
    enable: !isH5,
  }),
  presetAttributify({
    prefix: "u",
    prefixedOnly: true,
  }),
  presetRemRpx({ enable: true }),
];

export default defineConfig({
  shortcuts: {
    "bg-base": "bg-gray-100 dark:bg-dark",
    "bg-base-second": "bg-white dark:bg-dark-100",
    "color-base": "text-gray-700 dark:text-light-2",
    "color-base-second": "text-gray-400 dark:text-gray-500/60",
    "border-base": "border border-gray-200 dark:border-gray/60",
    "bg-primary": "bg-light-blue-500 dark:bg-light-blue-600",
  },
  presets,
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify({
      prefix: "u",
      prefixedOnly: true,
    }),
    transformerApplet(),
  ],
  rules: [
    [
      "p-safe",
      {
        padding:
          "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      },
    ],
    ["pt-safe", { "padding-top": "env(safe-area-inset-top)" }],
    ["pb-safe", { "padding-bottom": "env(safe-area-inset-bottom)" }],
  ],
})
