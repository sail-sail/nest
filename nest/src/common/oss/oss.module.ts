import { Global, Module } from "@nestjs/common";
import { OssController } from "./oss.controller";
import { MinioDao } from "./minio.dao";
import { OssResolver } from "./oss.resolver";
import { OssService } from "./oss.service";

@Global()
@Module({
  controllers: [
    OssController,
  ],
  providers: [
    OssResolver,
    OssService,
    MinioDao,
  ],
  exports: [
    OssService,
    MinioDao,
  ],
})
export class OssModule { }
