import { Module, Global } from '@nestjs/common';

import { Permit2Resolver } from './permit2.resolver';
import { Permit2Service } from './permit2.service';
import { Permit2Dao } from './permit2.dao';

@Global()
@Module({
  providers: [
    Permit2Resolver,
    Permit2Service,
    Permit2Dao,
  ],
  exports: [
    Permit2Resolver,
    Permit2Service,
    Permit2Dao,
  ],
})
export class Permit2Module { }
