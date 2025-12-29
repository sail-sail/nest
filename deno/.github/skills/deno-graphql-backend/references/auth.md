# 认证权限参考

## 工具函数

```typescript
import {
  get_usr_id,      // 获取用户ID
  get_org_id,      // 获取组织ID
  get_tenant_id,   // 获取租户ID
  getAuthModel,    // 获取完整认证信息
} from "/lib/auth/auth.dao.ts";
```

## 获取用户ID

```typescript
const usr_id = await get_usr_id();       // 可能未登录
const usr_id = await get_usr_id(false);  // 必须登录，否则抛异常
```

## 公开接口

```typescript
// Resolver 层设置
export async function publicApi() {
  const context = useContext();
  context.notVerifyToken = true;  // 不验证token
  // ...
}
```

## 权限检查

```typescript
const usr_id = await get_usr_id(false);
const doc = await findByIdOkDocument(id);
if (doc.create_usr_id !== usr_id) throw "无权访问";
```

## 数据隔离

```typescript
// 组织隔离
const org_id = await get_org_id();
const list = await findAllXxx({ ...search, org_id });

// 租户隔离
const tenant_id = await get_tenant_id();
const list = await findAllXxx({ ...search, tenant_id });
```
