import {
  type FormDataFile,
} from "oak";
import { S3 } from "S3";
import { getEnv } from "/lib/env.ts";
import { shortUuidV4 } from "/lib/util/string_util.ts";

async function getBucket() {
  const s3 = new S3({
    accessKeyID: await getEnv("tmpfile_accesskey"),
    secretKey: await getEnv("tmpfile_secretkey"),
    region: "us-east-1",
    endpointURL: await getEnv("tmpfile_endpoint"),
  });
  const bucket = s3.getBucket(await getEnv("tmpfile_bucket"));
  return bucket;
}

export async function upload(
  file: FormDataFile,
  opt?: {
    notDownloadMulti?: boolean,
  },
) {
  const bucket = await getBucket();
  let content = file.content;
  if (!content) {
    content = await Deno.readFile(file.filename!);
  }
  const meta: {
    filename?: string;
    once?: string;
  } = { };
  if (file.originalName) {
    meta.filename = encodeURIComponent(file.originalName);
  }
  if (opt?.notDownloadMulti) {
    meta.once = "1";
  }
  const id = shortUuidV4();
  await bucket.putObject(id, content, {
    contentType: file.contentType,
    meta,
  })
  return id;
}

export async function statObject(id: string) {
  const bucket = await getBucket();
  const obj = await bucket.headObject(id);
  return obj;
}

export async function getObject(id: string) {
  const bucket = await getBucket();
  const objInfo = await bucket.getObject(id);
  if (!objInfo || !objInfo.body) {
    const err = new Error("NotFound");
    // deno-lint-ignore no-explicit-any
    (err as any).code = "NotFound";
    throw err;
  }
  return {
    meta: objInfo.meta,
    body: objInfo.body,
  };
}

export async function deleteObject(id: string) {
  const bucket = await getBucket();
  await bucket.deleteObject(id);
}
