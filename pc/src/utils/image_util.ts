import * as webp from "@jsquash/webp";
import * as jpeg from "@jsquash/jpeg";
import * as png from "@jsquash/png";
import resize from "@jsquash/resize";

async function workerFn(file: File) {
    
  const maxImageWidth = 1920;
  const maxImageHeight = 1080;
  
  let buffer = await file.arrayBuffer();
  let imgData: ImageData;
  
  const contentType = file.type;
  
  if (contentType === "image/jpeg") {
    imgData = await jpeg.decode(buffer);
  } else if (contentType === "image/png") {
    imgData = await png.decode(buffer);
  } else if (contentType === "image/webp") {
    imgData = await webp.decode(buffer);
  } else {
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
  
  buffer = await webp.encode(imgData);
  
  const fileName = file.name.replace(/\.\w+$/, ".webp");
  const file2 = new File([ buffer ], fileName, { type: "image/webp" });
  return file2;
}

export async function checkImageMaxSize(
  file: File,
) {
  const file2 = await workerFn(file);
  return file2;
}
