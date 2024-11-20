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
  file: File,
  opt?: {
    once?: number;
    is_public?: boolean;
    tenant_id?: string;
    db?: string;
  },
) {
  const content = await file.arrayBuffer();
  const db = opt?.db;
  const is_public = opt?.is_public ? "1" : "0";
  const tenant_id = opt?.tenant_id;
  const meta: {
    filename?: string;
    once?: string;
    db?: string;
    is_public: "0" | "1";
    tenant_id?: string;
  } = {
    db,
    is_public,
    tenant_id,
  };
  if (file.name) {
    meta.filename = encodeURIComponent(file.name);
  }
  if (opt?.once) {
    meta.once = opt?.once.toString();
  }
  const id = shortUuidV4<string>();
  try {
    const bucket = await getBucket();
    await bucket.putObject(id, new Uint8Array(content), {
      contentType: file.type,
      meta,
    });
  } catch(_err: unknown) {
    const err = _err as S3Error;
    error("oss.upload S3Error: " + err.response);
  }
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
