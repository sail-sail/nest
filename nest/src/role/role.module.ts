import { Module, Global } from '@nestjs/common';

import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';
import { RoleDao } from './role.dao';

@Global()
@Module({
  providers: [
    RoleResolver,
    RoleService,
    RoleDao,
  ],
  exports: [
    RoleResolver,
    RoleService,
    RoleDao,
  ],
})
export class RoleModule { }
