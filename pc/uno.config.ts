import {
  promises as fs,
} from "node:fs";

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerAttributifyJsx,
  transformerCompileClass,
  transformerVariantGroup,
} from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  presets: [
    presetWind3(),
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
