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
  transformerAttributify,
} from "unocss-applet";

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApplet = process.env?.UNI_PLATFORM?.startsWith('mp-') ?? false;

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
    enable: isApplet,
  }),
  presetAttributify({
    prefix: "u",
    prefixedOnly: true,
  }),
  presetRemRpx(),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;

export default defineConfig({
  shortcuts: {
    "n-bg-base": "n-bg-gray-100 dark:n-bg-dark",
    "n-bg-base-second": "n-bg-white dark:n-bg-dark-100",
    "n-color-base": "n-text-gray-700 dark:n-text-light-2",
    "n-color-base-second": "n-text-gray-400 dark:n-text-gray-500/60",
    "n-border-base": "n-border n-border-gray-200 dark:n-border-gray/60",
    "n-bg-primary": "n-bg-light-blue-500 dark:n-bg-light-blue-600",
  },
  presets,
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify({
      prefix: "u",
      prefixedOnly: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  ],
  rules: [
    [
      "n-p-safe",
      {
        padding:
          "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      },
    ],
    ["n-pt-safe", { "padding-top": "env(safe-area-inset-top)" }],
    ["n-pb-safe", { "padding-bottom": "env(safe-area-inset-bottom)" }],
  ],
})
