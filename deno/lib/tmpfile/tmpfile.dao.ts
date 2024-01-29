import type {
  S3Bucket,
} from "S3";

import { getEnv } from "/lib/env.ts";
import { shortUuidV4 } from "/lib/util/string_util.ts";

import type {
  S3Error,
} from "S3/S3Error";

import {
  error
} from "/lib/context.ts";

let _bucket: S3Bucket | undefined;

export async function getBucket() {
  if (_bucket) {
    return _bucket;
  }
  const {
    S3,
  } = await import("S3");
  const s3 = new S3({
    accessKeyID: await getEnv("tmpfile_accesskey"),
    secretKey: await getEnv("tmpfile_secretkey"),
    region: "us-east-1",
    endpointURL: await getEnv("tmpfile_endpoint"),
  });
  const tmpfile_bucket = await getEnv("tmpfile_bucket");
  try {
    await s3.createBucket(tmpfile_bucket)
  // deno-lint-ignore no-empty
  } catch (_err) { }
  _bucket = s3.getBucket(tmpfile_bucket);
  return _bucket;
}

export async function upload(
  file: File,
) {
  
  const content = await file.arrayBuffer();
  const meta: {
    filename?: string;
  } = { };
  if (file.name) {
    meta.filename = encodeURIComponent(file.name);
  }
  const id = shortUuidV4<string>();
  try {
    const bucket = await getBucket();
    await bucket.putObject(id, new Uint8Array(content), {
      contentType: file.type,
      meta,
    })
  } catch(_err: unknown) {
    const err = _err as S3Error;
    error("oss.upload S3Error: " + err.response);
  }
  return id;
}

export async function putObject(
  id: string,
  content: Uint8Array,
  contentType?: string,
) {
  const bucket = await getBucket();
  await bucket.putObject(id, content, {
    contentType,
  });
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
