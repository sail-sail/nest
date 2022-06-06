import { Global, Module } from "@nestjs/common";
import { TmpfileController } from "./tmpfile.controller";
import { TmpfileDao } from "./tmpfile.dao";
import { TmpfileService } from "./tmpfile.service";

@Global()
@Module({
  controllers: [
    TmpfileController,
  ],
  providers: [
    TmpfileService,
    TmpfileDao,
  ],
  exports: [
    TmpfileService,
    TmpfileDao,
  ],
})
export class TmpfileModule { }
