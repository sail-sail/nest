import { Module, Global } from '@nestjs/common';

import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { MenuDao } from './menu.dao';

@Global()
@Module({
  providers: [
    MenuResolver,
    MenuService,
    MenuDao,
  ],
  exports: [
    MenuResolver,
    MenuService,
    MenuDao,
  ],
})
export class MenuModule { }
