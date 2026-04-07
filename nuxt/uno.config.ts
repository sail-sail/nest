import {
  promises as fs,
  // @ts-ignore
} from "node:fs";

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
  // @ts-ignore
} from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  shortcuts: [
    {
      "req": "before-content-[quoted:*] before-text-red before-m-r-0.25",
    },
  ],
  rules: [
    [
      "items-safe-center",
      {
        "align-items": "safe center",
      },
    ],
    [
      "justify-safe-center",
      {
        "justify-content": "safe center",
      },
    ],
  ],
  presets: [
    presetUno(),
    presetRemToPx(),
    presetIcons({
      warn: true,
      collections: {
        iconfont: async (iconName: string) => await fs.readFile(`./assets/iconfont/${ iconName }.svg`, "utf8"),
      },
    }),
    presetAttributify({
      prefix: "un-",
      prefixedOnly: true,
    }),
  ],
  transformers: [
    transformerCompileClass(),
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributifyJsx(),
  ],
});
