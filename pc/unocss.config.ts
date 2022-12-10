import {
  promises as fs,
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
} from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  presets: [
    presetUno(),
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
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributifyJsx(),
  ],
});
