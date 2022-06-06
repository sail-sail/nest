import { Module, Global } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { AuthModule } from "../auth/auth.module";

import { WxappController } from './wxapp.controller';
import { WxappService } from './wxapp.service';
import { WxappDao } from './wxapp.dao';

@Global()
@Module({
  imports: [
    AuthModule,
    HttpModule,
  ],
  controllers: [
    WxappController,
  ],
  providers: [
    WxappService,
    WxappDao,
  ],
  exports: [
    WxappService,
    WxappDao,
  ],
})
export class WxappModule { }
