import { Module, Global } from '@nestjs/common';

import { PermitResolver } from './permit.resolver';
import { PermitService } from './permit.service';
import { PermitDao } from './permit.dao';

@Global()
@Module({
  providers: [
    PermitResolver,
    PermitService,
    PermitDao,
  ],
  exports: [
    PermitResolver,
    PermitService,
    PermitDao,
  ],
})
export class PermitModule { }
