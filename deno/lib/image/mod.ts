// @ts-types="./image_wasm.d.ts"
import * as image_wasm from "./image_wasm.js";

/**
 * 压缩图片
 * @param content 图片的二进制数据
 * @param format 返回的图片格式, 默认为 webp, 可选值为 jpeg, png, webp
 * @param width 需要压缩的宽度, 默认为 0, 即不压缩, 跟height比较, 以较大长度为准
 * @param height 需要压缩的高度, 默认为 0, 即不压缩, 跟width比较, 以较大长度为准
 * @param quality 压缩的质量, 默认为 80, 范围为 0 ~ 100
 * @returns 返回压缩后的图片二进制数据
 */
export function resize(
  content: Uint8Array,
  format = "webp",
  width = 0,
  height = 0,
  quality = 80,
) {
  const content2 = image_wasm.resize(
    content,
    format,
    width,
    height,
    quality,
  );
  return content2;
}

function close() {
  // image.close();
}

export { close };
