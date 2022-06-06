import { Module, Global } from '@nestjs/common';

import { Tenant2Resolver } from './tenant2.resolver';
import { Tenant2Service } from './tenant2.service';
import { Tenant2Dao } from './tenant2.dao';

@Global()
@Module({
  providers: [
    Tenant2Resolver,
    Tenant2Service,
    Tenant2Dao,
  ],
  exports: [
    Tenant2Resolver,
    Tenant2Service,
    Tenant2Dao,
  ],
})
export class Tenant2Module { }
