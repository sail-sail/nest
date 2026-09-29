import {
  readFile,
  readdir,
} from "node:fs/promises";

import {
  join,
} from "node:path";

import {
  createS3BucketClient,
  readBackupManifest,
  resolveBackupDir,
  resolveEnvPath,
} from "./ossBucketBackupRestore.ts";

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

async function main() {
  const envArg = process.argv[2];
  if (!envArg) {
    throw new Error("请传入 .env 文件路径，例如: pnpm run oss_restore -- ../deno/.env.dev");
  }
  const envFilePath = resolveEnvPath(envArg);
  const backupDirInput = process.argv[3];
  const { bucketName, bucket } = await createS3BucketClient(envFilePath);
  const backupDir = resolveBackupDir(bucketName, backupDirInput);

  const manifest = await readBackupManifest(backupDir);
  for (const entry of manifest.entries) {
    const body = await readFile(entry.file);
    await bucket.putObject(entry.key, body, {
      contentType: entry.contentType,
      contentDisposition: entry.contentDisposition,
      cacheControl: entry.cacheControl,
      contentEncoding: entry.contentEncoding,
      contentLanguage: entry.contentLanguage,
      meta: entry.meta,
    });
  }

  console.log(`已恢复 ${manifest.entries.length} 个对象到桶 ${bucketName}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
