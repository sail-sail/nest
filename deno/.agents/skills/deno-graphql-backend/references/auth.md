# 认证权限参考

## 工具函数

```typescript
import {
  get_usr_id,
  get_org_id,
  getAuthModel,
} from "/lib/auth/auth.dao.ts";
```

## 获取用户ID

```typescript
// 可能未登录, 返回 UsrId | undefined
const usr_id = await get_usr_id();

// 必须登录, 未登录抛异常, 返回 UsrId
const usr_id = await get_usr_id(false);
```

## 获取组织ID

```typescript
// 可能未登录
const org_id = await get_org_id();

// 必须登录
const org_id = await get_org_id(false);
```

## 获取完整认证信息

```typescript
// 必须登录
const authModel = await getAuthModel(false);
// authModel.id       → UsrId
// authModel.org_id   → OrgId
// authModel.lang     → 语言编码
```

## 公开接口

在 Resolver 层设置：

```typescript
export async function publicApi() {

  const {
    publicApi,
  } = await import("./{table}.service.ts");

  const context = useContext();
  context.notVerifyToken = true; // 不验证token

  return await publicApi();
}
```

## 权限检查

```typescript
const usr_id = await get_usr_id(false);
const doc = await findByIdOkXxx(id);
if (doc.create_usr_id !== usr_id) {
  throw "无权访问";
}
```

## 数据隔离

```typescript
// 组织隔离
const org_id = await get_org_id();
const list = await findAllXxx({
  ...search,
  org_id,
});

// 用户隔离
const usr_id = await get_usr_id(false);
const list = await findAllXxx({
  ...search,
  create_usr_id: usr_id,
});
```
