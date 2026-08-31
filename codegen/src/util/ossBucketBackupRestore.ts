import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";

import {
  isAbsolute,
  join,
  resolve,
} from "node:path";

import { parse } from "dotenv";

import {
  S3,
} from "../lib/S3/mod.ts";

import type {
  S3Bucket,
} from "../lib/S3/mod.ts";

export interface BackupManifestEntry {
  key: string;
  file: string;
  contentType?: string;
  contentDisposition?: string;
  cacheControl?: string;
  contentEncoding?: string;
  contentLanguage?: string;
  meta?: Record<string, string>;
}

export interface BackupManifest {
  bucket: string;
  createdAt: string;
  entries: BackupManifestEntry[];
}

export interface S3EnvConfig {
  bucket: string;
  accessKeyID: string;
  secretKey: string;
  endpointURL: string;
  region: string;
}

export function resolveEnvPath(inputPath?: string) {
  if (!inputPath) {
    return resolve(process.cwd(), "../rust/.env");
  }
  if (isAbsolute(inputPath)) {
    return inputPath;
  }
  return resolve(process.cwd(), inputPath);
}

export async function loadS3EnvConfig(envFilePath: string): Promise<S3EnvConfig> {
  const envText = await readFile(envFilePath, "utf8");
  const env = parse(envText);
  const bucket = env.oss_bucket;
  const accessKeyID = env.oss_accesskey;
  const secretKey = env.oss_secretkey;
  const endpointURL = env.oss_endpoint;
  const region = env.oss_region || "us-east-1";

  if (!bucket || !accessKeyID || !secretKey || !endpointURL) {
    throw new Error(`无法从 ${envFilePath} 读取 oss_bucket / oss_accesskey / oss_secretkey / oss_endpoint 配置`);
  }

  return {
    bucket,
    accessKeyID,
    secretKey,
    endpointURL,
    region,
  };
}

export async function createS3BucketClient(envFilePath: string): Promise<{
  bucketName: string;
  bucket: S3Bucket;
  s3: S3;
}> {
  const cfg = await loadS3EnvConfig(envFilePath);
  const s3 = new S3({
    accessKeyID: cfg.accessKeyID,
    secretKey: cfg.secretKey,
    region: cfg.region,
    endpointURL: cfg.endpointURL,
  });
  try {
    await s3.createBucket(cfg.bucket);
  } catch (_err) {
    // bucket already exists or create not necessary
  }
  const bucket = s3.getBucket(cfg.bucket);
  return {
    bucketName: cfg.bucket,
    bucket,
    s3,
  };
}

export function resolveBackupDir(bucketName: string, backupDirInput?: string) {
  if (backupDirInput) {
    return resolve(process.cwd(), backupDirInput);
  }
  return resolve(process.cwd(), "tmp", "oss-bucket-backup", bucketName);
}

export async function streamToBuffer(body: any): Promise<Buffer> {
  const reader = body.getReader();
  const chunks: Buffer[] = [];
  let done = false;
  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (!done && result.value) {
      chunks.push(Buffer.from(result.value));
    }
  }
  return Buffer.concat(chunks);
}

export async function writeBackupManifest(backupDir: string, manifest: BackupManifest) {
  await mkdir(backupDir, { recursive: true });
  await writeFile(join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

export async function readBackupManifest(backupDir: string): Promise<BackupManifest> {
  const manifestText = await readFile(join(backupDir, "manifest.json"), "utf8");
  return JSON.parse(manifestText) as BackupManifest;
}
