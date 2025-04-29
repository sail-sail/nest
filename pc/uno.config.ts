import {
  promises as fs,
} from "node:fs";

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerAttributifyJsx,
  transformerCompileClass,
  transformerVariantGroup,
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
    presetWind4(),
    presetRemToPx(),
    presetIcons({
      warn: true,
      collections: {
        iconfont: async (iconName) => await fs.readFile(`./src/assets/iconfont/${ iconName }.svg`, "utf8"),
      },
    }),
    presetAttributify({
      prefix: "un-",
      prefixedOnly: true,
    }),
  ],
  transformers: [
    transformerCompileClass(),
    transformerVariantGroup(),
    transformerAttributifyJsx(),
  ],
});
