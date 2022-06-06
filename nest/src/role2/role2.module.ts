import { Module, Global } from '@nestjs/common';

import { Role2Resolver } from './role2.resolver';
import { Role2Service } from './role2.service';
import { Role2Dao } from './role2.dao';

@Global()
@Module({
  providers: [
    Role2Resolver,
    Role2Service,
    Role2Dao,
  ],
  exports: [
    Role2Resolver,
    Role2Service,
    Role2Dao,
  ],
})
export class Role2Module { }
