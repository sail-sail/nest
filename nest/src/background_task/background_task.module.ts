import { Module, Global } from '@nestjs/common';

import { Background_taskResolver } from './background_task.resolver';
import { Background_taskService } from './background_task.service';
import { Background_taskDao } from './background_task.dao';

@Global()
@Module({
  providers: [
    Background_taskResolver,
    Background_taskService,
    Background_taskDao,
  ],
  exports: [
    Background_taskResolver,
    Background_taskService,
    Background_taskDao,
  ],
})
export class Background_taskModule { }
