import { Module, Global } from '@nestjs/common';

import { Background_task2Resolver } from './background_task2.resolver';
import { Background_task2Service } from './background_task2.service';
import { Background_task2Dao } from './background_task2.dao';

@Global()
@Module({
  providers: [
    Background_task2Resolver,
    Background_task2Service,
    Background_task2Dao,
  ],
  exports: [
    Background_task2Resolver,
    Background_task2Service,
    Background_task2Dao,
  ],
})
export class Background_task2Module { }
