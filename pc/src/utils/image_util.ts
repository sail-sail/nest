import imageSize from "image-size";

import type {
  ISizeCalculationResult,
} from "image-size/dist/types/interface";

const maxImageWidth = 1024;
const maxImageHeight = 768;

const { workerFn } = useWebWorkerFn(
  async function (buffer: Uint8Array, dimensions: ISizeCalculationResult) {
    const maxImageWidth = 1024;
    const maxImageHeight = 768;
    try {
      return buffer;
    } catch (err) {
      console.error("checkImageMaxSize", buffer);
      return buffer;
    }
  },
  {
    dependencies: [
    ],
  },
);

export async function checkImageMaxSize(
  file: File,
) {
  return file;
  // const buffer: Uint8Array = await new Promise((resolve) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     resolve(new Uint8Array(reader.result as ArrayBuffer));
  //   };
  //   reader.readAsArrayBuffer(file);
  // });
  // let dimensions: ISizeCalculationResult | undefined;
  // try {
  //   dimensions = imageSize(buffer);
  //   if (!dimensions?.width || !dimensions?.height) {
  //     return file;
  //   }
  //   if (dimensions.width <= maxImageWidth || dimensions.height <= maxImageHeight) {
  //     return file;
  //   }
  // } catch (err) {
  //   console.error(err);
  //   return file;
  // }
  // const buffer2 = await workerFn(buffer, dimensions);
  // return new File([ buffer2 ], file.name, {
  //   type: file.type,
  // });
}
