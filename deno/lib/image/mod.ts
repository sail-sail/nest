import sharp from "sharp";

function normalizeFormat(format: string) {
  const format0 = format.toLowerCase();
  if (format0 === "jpg") {
    return "jpeg";
  }
  if (format0 === "jpeg" || format0 === "png" || format0 === "webp") {
    return format0;
  }
  return "webp";
}

/**
 * 压缩图片
 * @param content 图片的二进制数据
 * @param format 返回的图片格式, 默认为 webp, 可选值为 jpeg, png, webp
 * @param width 需要压缩的宽度, 默认为 0, 即不压缩, 跟height比较, 以较大长度为准
 * @param height 需要压缩的高度, 默认为 0, 即不压缩, 跟width比较, 以较大长度为准
 * @param quality 压缩的质量, 默认为 80, 范围为 0 ~ 100
 * @returns 返回压缩后的图片二进制数据
 */
export async function resize(
  content: Uint8Array,
  format = "webp",
  width = 0,
  height = 0,
  quality = 80,
) {
  const format0 = normalizeFormat(format);
  const width0 = width > 0 ? width : undefined;
  const height0 = height > 0 ? height : undefined;
  let img = sharp(content);
  if (width0 != null || height0 != null) {
    img = img.resize({
      width: width0,
      height: height0,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  if (format0 === "jpeg") {
    img = img.jpeg({
      quality,
    });
  } else if (format0 === "png") {
    img = img.png();
  } else {
    img = img.webp({
      quality,
    });
  }
  return await img.toBuffer();
}

function close() {
  // image.close();
}

export { close };
