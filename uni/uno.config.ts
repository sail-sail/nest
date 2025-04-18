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

const isApplet = process.env?.UNI_PLATFORM?.startsWith('mp-') ?? false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presets: any[] = [
  presetIcons({
    prefix: "i-",
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
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformers: any[] = [
  transformerDirectives(),
  transformerVariantGroup(),
];

if (isApplet) {
  presets.push(presetApplet());
  presets.push(presetRemRpx());
  transformers.push(transformerAttributify({
    prefix: "un-",
    prefixedOnly: true,
  }));
} else {
  presets.push(presetApplet());
  presets.push(presetAttributify({
    prefix: "un-",
    prefixedOnly: true,
  }));
  presets.push(presetRemRpx({ mode: "rpx2rem" }));
  transformers.push(transformerAttributify({
    prefix: "un-",
    prefixedOnly: true,
  }));
}

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
  transformers,
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
