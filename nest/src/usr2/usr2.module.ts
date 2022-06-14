import { Module, Global } from '@nestjs/common';

import { Usr2Resolver } from './usr2.resolver';
import { Usr2Service } from './usr2.service';
import { Usr2Dao } from './usr2.dao';

@Global()
@Module({
  providers: [
    Usr2Resolver,
    Usr2Service,
    Usr2Dao,
  ],
  exports: [
    Usr2Resolver,
    Usr2Service,
    Usr2Dao,
  ],
})
export class Usr2Module { }
