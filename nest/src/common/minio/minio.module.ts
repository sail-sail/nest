import { Global, Module } from "@nestjs/common";
import { MinioController } from "./minio.controller";
import { MinioDao } from "./minio.dao";
import { MinioResolver } from "./minio.resolver";
import { MinioService } from "./minio.service";

@Global()
@Module({
  controllers: [
    MinioController,
  ],
  providers: [
    MinioResolver,
    MinioService,
    MinioDao,
  ],
  exports: [
    MinioService,
    MinioDao,
  ],
})
export class MinioModule { }
