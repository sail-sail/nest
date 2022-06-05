#### 登录逻辑
+ 根据 `当前网址的域名+端口` 获取 `租户列表`

+ 若当前为 `开发环境`, 则返根据 `order_by` 升序返回 `租户列表`, 默认选中 `第一项`

+ 若当前为 `生产环境`, 则根据根据 `order_by` 升序 和 `当前网址的域名+端口` 获取租户列表, 默认选中 `第一项`

+ 根据 选中的租户 + 用户名 + 密码 登录

```typescript
  /**
   * 根据 当前网址的域名+端口 获取 租户列表
   * @param {string} host
   * @returns {Promise<{ id: string, lbl: string }[]>}
   * @memberof Tenant2Service
   */
  async getLoginTenants(
    host: string,
  ): Promise<{ id: string, lbl: string }[]> {
    const t = this;
    const search: TenantSearch = {
      orderBy: "order_by",
      orderDec: "asc",
    };
    if (process.env.NODE_ENV === "production") {
      search.bind_url = host;
    }
    const models = await t.tenantDao.findAll(search);
    return models.map((model) => ({
      id: model.id,
      lbl: model.lbl,
    }));
  }
```

+ 登录成功后获取 `authorization`

+ 超级管理员职责为: 
  1. 管理租户
  1. 管理菜单
  1. 分配给某个租户 菜单 和 菜单下的权限
  1. 查看所有登录日志
  1. 查看所有操作日志

+ 租户管理员指责为:
  1. 管理角色
  1. 管理用户
  1. 管理该租户下的菜单
  1. 管理菜单下的权限
  1. 管理组织架构
  1. 管理本租户的企业微信, 微信小程序等账号配置