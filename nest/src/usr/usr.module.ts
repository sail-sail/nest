import { Module, Global } from '@nestjs/common';

import { UsrResolver } from './usr.resolver';
import { UsrService } from './usr.service';
import { UsrDao } from './usr.dao';

@Global()
@Module({
  providers: [
    UsrResolver,
    UsrService,
    UsrDao,
  ],
  exports: [
    UsrResolver,
    UsrService,
    UsrDao,
  ],
})
export class UsrModule { }
