import { Module, Global } from '@nestjs/common';

import { TenantResolver } from './tenant.resolver';
import { TenantService } from './tenant.service';
import { TenantDao } from './tenant.dao';

@Global()
@Module({
  providers: [
    TenantResolver,
    TenantService,
    TenantDao,
  ],
  exports: [
    TenantResolver,
    TenantService,
    TenantDao,
  ],
})
export class TenantModule { }
