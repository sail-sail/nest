import { MenuModule } from "./menu/menu.module";
import { Menu2Module } from "./menu2/menu2.module";

import { PermitModule } from "./permit/permit.module";
import { Permit2Module } from "./permit2/permit2.module";

import { RoleModule } from "./role/role.module";
import { Role2Module } from "./role2/role2.module";

import { TenantModule } from "./tenant/tenant.module";
import { Tenant2Module } from "./tenant2/tenant2.module";

import { UsrModule } from "./usr/usr.module";
import { Usr2Module } from "./usr2/usr2.module";


export default [
  
  MenuModule, // 菜单
  Menu2Module,
  
  PermitModule, // 权限
  Permit2Module,
  
  RoleModule, // 角色
  Role2Module,
  
  TenantModule, // 租户
  Tenant2Module,
  
  UsrModule, // 用户
  Usr2Module,
  
];
