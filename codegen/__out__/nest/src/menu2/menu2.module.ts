import { Module, Global } from '@nestjs/common';

import { Menu2Resolver } from './menu2.resolver';
import { Menu2Service } from './menu2.service';
import { Menu2Dao } from './menu2.dao';

@Global()
@Module({
  providers: [
    Menu2Resolver,
    Menu2Service,
    Menu2Dao,
  ],
  exports: [
    Menu2Resolver,
    Menu2Service,
    Menu2Dao,
  ],
})
export class Menu2Module { }
