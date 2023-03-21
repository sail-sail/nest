import {
  type FormDataFile,
} from "oak";

import {
  S3,
  type S3Bucket,
} from "S3";

import { getEnv } from "/lib/env.ts";
import { shortUuidV4 } from "/lib/util/string_util.ts";

let _bucket: S3Bucket | undefined;

export async function getBucket() {
  if (_bucket) {
    return _bucket;
  }
  const s3 = new S3({
    accessKeyID: await getEnv("oss_accesskey"),
    secretKey: await getEnv("oss_secretkey"),
    region: "us-east-1",
    endpointURL: await getEnv("oss_endpoint"),
  });
  const oss_bucket = await getEnv("oss_bucket");
  try {
    await s3.createBucket(oss_bucket)
  // deno-lint-ignore no-empty
  } catch (_err) { }
  _bucket = s3.getBucket(oss_bucket);
  return _bucket;
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
  const obj = await bucket.getObject(id);
  if (!obj) {
    return;
  }
  return {
    meta: obj.meta,
    body: obj.body,
  };
}

export async function deleteObject(id: string) {
  const bucket = await getBucket();
  await bucket.deleteObject(id);
}
