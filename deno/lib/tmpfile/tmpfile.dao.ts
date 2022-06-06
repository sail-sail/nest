import { FormDataFile } from "oak";
import { S3 } from "S3";
import { shortUuidV4 } from "../string_util.ts";

function getBucket() {
  const s3 = new S3({
    accessKeyID: Deno.env.get("tmpfile_accesskey")!,
    secretKey: Deno.env.get("tmpfile_secretkey")!,
    region: "us-east-1",
    endpointURL: Deno.env.get("tmpfile_endpoint"),
  });
  const bucket = s3.getBucket(Deno.env.get("tmpfile_bucket")!);
  return bucket;
}

export async function upload(
  file: FormDataFile,
  opt?: {
    notDownloadMulti?: boolean,
  },
) {
  const bucket = getBucket();
  let content = file.content;
  if (!content) {
    content = await Deno.readFile(file.filename!);
  }
  const meta: {
    "x-amz-meta-filename"?: string;
    "x-amz-meta-once"?: string;
  } = { };
  if (file.originalName) {
    meta["x-amz-meta-filename"] = encodeURIComponent(file.originalName);
  }
  if (opt?.notDownloadMulti) {
    meta["x-amz-meta-once"] = "1";
  }
  const id = shortUuidV4();
  await bucket.putObject(id, content, {
    contentType: file.contentType,
    meta,
  })
  return id;
}

export async function statObject(id: string) {
  const bucket = getBucket();
  const obj = await bucket.headObject(id);
  return obj;
}

export async function getObject(id: string) {
  const bucket = getBucket();
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
  const bucket = getBucket();
  await bucket.deleteObject(id);
}