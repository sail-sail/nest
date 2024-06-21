import { encode } from "@jsquash/webp";
import resize from "@jsquash/resize";

async function getImageDataByCanvas(buf: ArrayBuffer, type: string) {
  const img = new Image();
  const blob = new Blob([ buf ], { type });
  const url = URL.createObjectURL(blob);
  img.src = url;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  return imgData;
}

async function workerFn(
  file: File,
  opts?: {
    compress: boolean,
    maxImageWidth?: number,
    maxImageHeight?: number,
  },
) {
  
  const compress = opts?.compress ?? true;
  
  if (!compress) {
    return file;
  }
    
  const maxImageWidth = opts?.maxImageWidth ?? 1920;
  const maxImageHeight = opts?.maxImageHeight ?? 1080;
  
  let buffer = await file.arrayBuffer();
  let imgData = await getImageDataByCanvas(buffer, file.type);
  if (!imgData) {
    return file;
  }
  
  let { width, height } = imgData;
  
  if (width > maxImageWidth) {
    height = Math.round(height * maxImageWidth / width);
    width = maxImageWidth;
  }
  
  if (height > maxImageHeight) {
    width = Math.round(width * maxImageHeight / height);
    height = maxImageHeight;
  }
  
  imgData = await resize(imgData, { width, height });
  
  buffer = await encode(imgData);
  
  const fileName = file.name.substring(0, file.name.lastIndexOf(".")) + ".webp";
  const file2 = new File([ buffer ], fileName, { type: "image/webp" });
  return file2;
}

export async function checkImageMaxSize(
  file: File,
  opts?: {
    compress: boolean,
    maxImageWidth?: number,
    maxImageHeight?: number,
  },
) {
  const file2 = await workerFn(file, opts);
  return file2;
}
