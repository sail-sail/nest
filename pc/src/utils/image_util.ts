import imageSize from "image-size";

export async function checkImageMaxSize(
  file: File,
) {
  const buffer: Uint8Array = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    };
    reader.readAsArrayBuffer(file);
  });
  const dimensions = imageSize(buffer);
  console.log(dimensions);
  if (!dimensions?.width || !dimensions?.height) {
    return file;
  }
  if (dimensions.width <= 1024 || dimensions.height <= 768) {
    return file;
  }
  return new File([ buffer ], file.name, {
    type: file.type,
  });
}
