import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import {
  join,
  resolve,
} from "node:path";

import {
  createS3BucketClient,
  resolveBackupDir,
  resolveEnvPath,
  streamToBuffer,
  writeBackupManifest,
} from "./ossBucketBackupRestore.ts";

async function main() {
  const envArg = process.argv[2];
  if (!envArg) {
    throw new Error("请传入 .env 文件路径，例如: pnpm run oss_backup -- ../deno/.env.dev");
  }
  const envFilePath = resolveEnvPath(envArg);
  const backupDirInput = process.argv[3];

  const { bucketName, bucket } = await createS3BucketClient(envFilePath);
  const backupDir = resolveBackupDir(bucketName, backupDirInput);
  await mkdir(backupDir, { recursive: true });

  const manifest = {
    bucket: bucketName,
    createdAt: new Date().toISOString(),
    entries: [] as Array<{
      key: string;
      file: string;
      contentType?: string;
      contentDisposition?: string;
      cacheControl?: string;
      contentEncoding?: string;
      contentLanguage?: string;
      meta?: Record<string, string>;
    }>,
  };

  for await (const object of (bucket as any).listAllObjects({ batchSize: 1000 })) {
    if (!object.key) {
      continue;
    }

    const objectInfo = await bucket.headObject(object.key);
    const objectData = await bucket.getObject(object.key);
    if (!objectData?.body) {
      continue;
    }

    const bodyBuffer = await streamToBuffer(objectData.body as any);
    const objectFile = join(backupDir, encodeURIComponent(object.key));
    await mkdir(resolve(objectFile, ".."), { recursive: true });
    await writeFile(objectFile, bodyBuffer);

    manifest.entries.push({
      key: object.key,
      file: objectFile,
      contentType: objectInfo?.contentType,
      contentDisposition: objectInfo?.contentDisposition,
      cacheControl: objectInfo?.cacheControl,
      contentEncoding: objectInfo?.contentEncoding,
      contentLanguage: objectInfo?.contentLanguage,
      meta: objectInfo?.meta,
    });
  }

  await writeBackupManifest(backupDir, manifest);
  console.log(`已备份 ${manifest.entries.length} 个对象到 ${backupDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
