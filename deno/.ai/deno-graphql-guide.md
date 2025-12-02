# Deno GraphQL 后端接口开发规范

> 本文档定义了 Deno GraphQL 后端接口的标准开发流程和代码规范

## 目录结构说明

```
deno/
├── gen/             # 自动生成的代码(尽量不修改)
│   ├── base/
│   ├── types.ts
│   └── graphql.ts
└── src/             # 手写代码(定制开发接口)
    ├── base/
    ├── graphql.ts
    └── ...
```

**重要原则:**
- `gen/` 目录代码由工具生成,除非必要否则不要修改
- `src/` 目录用于手写业务逻辑和定制接口
- 上面的 `base` 等代表模块的名字, `base` 是基础模块等
- 每个模块按照三层架构组织:`graphql → resolver → service`
- DAO 层通常不需要手写,直接使用 `gen/` 中生成的 DAO 函数

---

## 类型自动生成机制

**GraphQL Codegen 自动生成流程:**

1. **监听机制**: 项目启动时(`nr start`),`mother.js` 会启动 `graphqlCodegen()` 函数
2. **文件监听**: 监听所有 `*.graphql.ts` 文件的变化
3. **自动生成**: 文件变化时自动执行代码生成,将 GraphQL Schema 转换为 TypeScript 类型定义
4. **输出文件**: 生成到 `/gen/types.ts` 文件中

**示例:**

在 GraphQL Schema 中定义:
```typescript
type FindMenuAndRoles {
  menu_model: MenuModel
  role_models: [RoleModel!]!
}
```

会自动生成 TypeScript 类型到 `/gen/types.ts`:
```typescript
export type FindMenuAndRoles = {
  menu_model?: MenuModel;
  role_models: Array<RoleModel>;
};
```

**注意:**
- 无需手动创建 `*.model.ts` 文件来定义类型
- 修改 GraphQL Schema 后,类型会自动更新
- 直接从 `/gen/types.ts` 导入使用即可

---

## 标准三层架构

每个功能模块通常包含以下三个文件:

### 1. GraphQL 层 (`*.graphql.ts`)

**职责:** 定义 GraphQL Schema、导出 Resolver

**标准模板:**

```typescript
import { defineGraphql } from "/lib/context.ts";

import * as xxxResolver from "./xxx.resolver.ts";

defineGraphql(xxxResolver, /* GraphQL */ `

  type XxxModel {
    id: XxxId!
    lbl: String!
    # 其他字段...
  }
  
  input XxxInput {
    lbl: String!
    # 其他字段...
  }
  
  type Query {
    "查询描述(必须写注释)"
    getXxx(id: XxxId!): XxxModel
    
    "列表查询描述"
    findAllXxx(
      search: XxxSearch
    ): [XxxModel!]!
  }
  
  type Mutation {
    "创建描述"
    createXxx(
      input: XxxInput!
    ): XxxId!
    
    "更新描述"
    updateXxx(
      id: XxxId!
      input: XxxInput!
    ): Boolean!
    
    "删除描述"
    deleteXxx(
      ids: [XxxId!]!
    ): Int!
  }
  
`);
```

**关键点:**
- 使用 `defineGraphql(resolver, schema)` 定义接口
- 第一个参数是 resolver 模块(通常用 `* as xxxResolver`)
- 第二个参数是 GraphQL Schema 字符串
- 每个字段和接口必须添加中文注释说明
- Query 用于查询操作
- Mutation 用于修改操作(增删改)
- **类型自动生成**: 在 GraphQL Schema 中定义的类型(type/input)会自动生成到 `/gen/types.ts`,无需手动创建

---

### 2. Resolver 层 (`*.resolver.ts`)

**职责:** 参数处理、上下文设置、调用 Service 层

**标准模板:**

```typescript
import {
  useContext,
} from "/lib/context.ts";

import type {
  QueryGetXxxArgs,
  MutationCreateXxxArgs,
  XxxModel,
  XxxInput,
} from "/gen/types.ts";

/**
 * 查询单个(需要登录)
 */
export async function getXxx(
  id: XxxId,
): Promise<XxxModel | undefined> {
  const {
    getXxx,
  } = await import("./xxx.service.ts");
  return await getXxx(id);
}

/**
 * 创建(需要登录 + 事务)
 */
export async function createXxx(
  input: XxxInput,
): Promise<XxxId> {
  const {
    createXxx,
  } = await import("./xxx.service.ts");
  const context = useContext();
  
  // 标记需要事务
  context.is_tran = true;
  return await createXxx(input);
}

/**
 * 公开接口(不需要登录)
 */
export async function publicMethod(
  param: string,
): Promise<string> {
  const {
    publicMethod,
  } = await import("./xxx.service.ts");
  const context = useContext();
  
  // 标记不验证 token
  context.notVerifyToken = true;
  return await publicMethod(param);
}
```

**关键点:**
- 函数名与 GraphQL Schema 中定义的名称一致
- 使用 `useContext()` 获取上下文
- **事务规则**: 只有会修改数据库的操作(增删改)才需要 `context.is_tran = true`,纯查询操作不需要
- **登录规则**: 默认需要登录,公开接口才设置 `context.notVerifyToken = true`
- 使用动态 import 导入 service 避免循环依赖
- 直接调用 Service 层,透传参数

---

### 3. Service 层 (`*.service.ts`)

**职责:** 核心业务逻辑、数据库操作、业务校验

**标准模板:**

```typescript
import {
  get_usr_id,
  get_org_id,
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

// 导入需要的 DAO 函数
import {
  findByIdXxx,
  findOneXxx,
  findAllXxx,
  createXxx as createXxxDao,
  updateByIdXxx,
  deleteByIdsXxx,
  validateOptionXxx,
  validateIsEnabledXxx,
} from "/gen/base/xxx/xxx.dao.ts";

// 导入类型定义(自动生成)
import type {
  XxxId,
  XxxInput,
  XxxModel,
  XxxSearch,
} from "/gen/types.ts";

/**
 * 查询单个
 */
export async function getXxx(
  id: XxxId,
): Promise<XxxModel | undefined> {
  // 1. 获取当前用户(如果需要)
  const usr_id = await get_usr_id();
  if (!usr_id) {
    throw "未登录";
  }
  
  // 2. 查询数据
  const model = await findByIdXxx(id);
  if (!model) {
    throw "记录不存在";
  }
  
  // 3. 权限校验(示例)
  if (model.create_usr_id !== usr_id) {
    throw "无权访问";
  }
  
  return model;
}

/**
 * 创建记录
 */
export async function createXxx(
  input: XxxInput,
): Promise<XxxId> {
  // 1. 参数校验
  if (isEmpty(input.lbl)) {
    throw "名称不能为空";
  }
  
  // 2. 获取当前用户
  const usr_id = await get_usr_id();
  if (!usr_id) {
    throw "未登录";
  }
  
  // 3. 业务校验(检查重复等)
  const existModel = await findOneXxx({
    lbl: input.lbl,
  });
  if (existModel) {
    throw "名称已存在";
  }
  
  // 4. 创建记录
  const id = await createXxxDao(input);
  
  return id;
}

/**
 * 更新记录
 */
export async function updateXxx(
  id: XxxId,
  input: XxxInput,
): Promise<boolean> {
  // 1. 参数校验
  if (isEmpty(input.lbl)) {
    throw "名称不能为空";
  }
  
  // 2. 查询原记录
  const model = await validateOptionXxx(
    await findByIdXxx(id),
  );
  
  // 3. 状态校验
  await validateIsEnabledXxx(model);
  
  // 4. 权限校验
  const usr_id = await get_usr_id();
  if (model.create_usr_id !== usr_id) {
    throw "无权修改";
  }
  
  // 5. 更新
  await updateByIdXxx(id, input);
  
  return true;
}

/**
 * 删除记录
 */
export async function deleteXxx(
  ids: XxxId[],
): Promise<number> {
  if (!ids || ids.length === 0) {
    throw "请选择要删除的记录";
  }
  
  // 批量删除
  const count = await deleteByIdsXxx(ids);
  
  return count;
}

/**
 * 条件查询列表
 */
export async function findAllXxx(
  search?: XxxSearch,
): Promise<XxxModel[]> {
  // 获取当前用户数据权限
  const usr_id = await get_usr_id();
  
  // 构建查询条件
  const searchCondition: XxxSearch = {
    ...search,
    // 只查询自己创建的
    create_usr_id: usr_id,
  };
  
  const list = await findAllXxx(searchCondition);
  
  return list;
}
```

**关键点:**
- 所有业务逻辑和数据库操作都在这一层
- 使用 `gen/` 中生成的 DAO 函数进行数据库操作
- 错误使用 `throw "中文错误提示"` (不打印堆栈)
- 需要堆栈时使用 `throw new Error("错误信息")`
- 遵循: 参数校验 → 权限检查 → 数据查询 → 业务校验 → 数据操作 → 返回结果

---

## 常用 DAO 函数规范

所有 DAO 函数都从 `gen/base/xxx/xxx.dao.ts` 导入:

| 函数名 | 用途 | 返回值 | 说明 |
|--------|------|--------|------|
| `findByIdXxx` | 根据ID查询 | `Promise<XxxModel \| undefined>` | 不存在返回 undefined |
| `findByIdOkXxx` | 根据ID查询(必存在) | `Promise<XxxModel>` | 不存在抛异常 |
| `findByIdsXxx` | 根据ID列表查询 | `Promise<XxxModel[]>` | 批量查询 |
| `findByIdsOkXxx` | 根据ID列表查询 | `Promise<XxxModel[]>` | 全部存在且顺序跟ids一致 |
| `findOneXxx` | 条件查询单条 | `Promise<XxxModel \| undefined>` | 使用 Search 对象 |
| `findAllXxx` | 条件查询所有 | `Promise<XxxModel[]>` | 支持排序、分页 |
| `findCountXxx` | 条件查询数量 | `Promise<number>` | 统计记录数 |
| `createXxx` | 创建记录 | `Promise<XxxId>` | 返回新记录ID |
| `createReturnXxx` | 创建记录并返回 | `Promise<XxxModel>` | 返回完整记录 |
| `updateByIdXxx` | 根据ID更新 | `Promise<number>` | 返回影响行数 |
| `deleteByIdsXxx` | 根据ID列表删除 | `Promise<number>` | 逻辑删除 |
| `revertByIdsXxx` | 根据ID列表恢复 | `Promise<number>` | 恢复逻辑删除 |
| `forceDeleteByIdsXxx` | 根据ID列表物理删除 | `Promise<number>` | 永久删除 |
| `validateOptionXxx` | 校验 Optional | `Promise<XxxModel>` | undefined 时抛异常 |
| `validateIsEnabledXxx` | 校验启用状态 | `Promise<void>` | 禁用时抛异常 |
| `findLastOrderByXxx` | 查询最大排序值 | `Promise<number>` | 用于排序字段 |

**使用示例:**

```typescript
// 查询 + 校验存在(方式1)
const model = await validateOptionXxx(
  await findByIdXxx(id),
);

// 查询 + 校验存在(方式2, 更简洁)
const model = await findByIdOkXxx(id);

// 批量查询(保证顺序和存在性)
const models = await findByIdsOkXxx([id1, id2, id3]);

// 状态校验
await validateIsEnabledXxx(model);

// 条件查询
const model = await findOneXxx({
  lbl: "测试",
  is_enabled: 1,
});

// 创建并返回ID
const id = await createXxx({
  lbl: "测试",
  remark: "备注",
});

// 创建并返回完整记录
const model = await createReturnXxx({
  lbl: "测试",
  remark: "备注",
});

// 更新
await updateByIdXxx(id, {
  lbl: "新名称",
});

// 逻辑删除
const count = await deleteByIdsXxx([id1, id2]);

// 恢复删除
const count = await revertByIdsXxx([id1, id2]);

// 物理删除(永久删除)
const count = await forceDeleteByIdsXxx([id1, id2]);

// 获取最大排序值(用于新增时设置排序)
const maxOrder = await findLastOrderByXxx();
const newOrder = maxOrder + 1;
```

---

## 常用辅助函数

```typescript
import {
  get_usr_id,      // 获取当前登录用户ID(无则返回 undefined)
  get_org_id,      // 获取当前组织ID(无则返回 undefined)
  getAuthModel,    // 获取当前认证信息(无则返回 undefined)
  get_lang_code,   // 获取当前语言编码
  get_lang_id,     // 获取当前语言ID
  createToken,     // 创建 JWT token
} from "/lib/auth/auth.dao.ts";

// 使用示例
const usr_id = await get_usr_id();
if (!usr_id) {
  throw "未登录";
}

const org_id = await get_org_id();

const authModel = await getAuthModel();
// authModel 包含: id, org_id, tenant_id, lang 等
```

**重载函数说明:**

```typescript
// get_usr_id() - 返回 UsrId | undefined
const usr_id = await get_usr_id();

// get_usr_id(false) - 必须登录,否则抛异常
const usr_id = await get_usr_id(false);

// get_usr_id(true) - 不验证 token,返回 UsrId | undefined
const usr_id = await get_usr_id(true);
```

---

## 模块注册规范

创建新模块后需要在对应的 `graphql.ts` 中注册:

### 1. 模块内注册

假设创建了 `src/base/employee/` 目录:

```
src/base/employee/
├── employee.graphql.ts
├── employee.resolver.ts
└── employee.service.ts
```

### 2. 在 `src/base/graphql.ts` 中注册

```typescript
import "./org/org.graphql.ts";
import "./menu/menu.graphql.ts";
import "./tenant/tenant.graphql.ts";
import "./usr/usr.graphql.ts";
// ... 其他模块

// 添加新模块
import "./employee/employee.graphql.ts";
```

### 3. 最终在 `src/graphql.ts` 中导入

```typescript
import "/src/base/graphql.ts";
```

**层级关系:**
```
src/graphql.ts
  └── src/base/graphql.ts
       ├── src/base/usr/usr.graphql.ts
       ├── src/base/org/org.graphql.ts
       └── src/base/employee/employee.graphql.ts (新增)
```

---

## Context 上下文说明

### 获取上下文

```typescript
import {
  useContext,      // 获取上下文(必须在异步上下文中)
  useMaybeContext, // 尝试获取上下文(无则返回 undefined)
} from "/lib/context.ts";

const context = useContext();
```

### 常用上下文属性

```typescript
// 1. 不验证 token(公开接口)
context.notVerifyToken = true;

// 2. 启用数据库事务
context.is_tran = true;

// 3. 其他属性(不常用)
context.lang         // 当前语言
context.ip           // 客户端IP
context.cacheMap     // 缓存Map
```

### 事务使用规则

**需要事务的场景:**
- ✅ 创建记录 (create/add)
- ✅ 更新记录 (update/edit)
- ✅ 删除记录 (delete/remove)
- ✅ 任何修改数据库的操作
- ✅ 多个数据库操作需要原子性保证

**不需要事务的场景:**
- ❌ 纯查询操作 (get/find/list)
- ❌ 只读接口
- ❌ 不涉及数据库修改的操作

**示例:**
```typescript
// 查询接口 - 不需要事务
export async function getUser(id: UsrId) {
  const { getUser } = await import("./usr.service.ts");
  // 无需设置 context.is_tran
  return await getUser(id);
}

// 修改接口 - 需要事务
export async function updateUser(id: UsrId, input: UsrInput) {
  const { updateUser } = await import("./usr.service.ts");
  const context = useContext();
  context.is_tran = true;  // 必须设置
  return await updateUser(id, input);
}
```

---

## 错误处理规范

### 1. 业务错误(不打印堆栈)

```typescript
// 简单错误
throw "参数不能为空";
throw "用户名或密码错误";
throw "无权访问";

// 参数校验
if (isEmpty(username)) {
  throw "用户名不能为空";
}
```

### 2. 系统错误(打印堆栈)

```typescript
// 需要调试信息时
throw new Error("数据库连接失败");
throw new Error("文件读取失败");
```

### 3. 特殊错误(不回滚事务)

```typescript
import { ServiceException } from "/lib/exceptions/service.exception.ts";

// 不希望回滚事务的错误(不常见)
throw new ServiceException("提示信息", "error_code");
```

---

## 命名约定

### 文件命名
- GraphQL 层: `{module}.graphql.ts`
- Resolver 层: `{module}.resolver.ts`
- Service 层: `{module}.service.ts`
- 自定义 DAO: `{module}.dao.ts`

### 函数命名(驼峰式)
- 查询: `getXxx`, `findXxx`, `findAllXxx`
- 创建: `createXxx`, `addXxx`
- 修改: `updateXxx`, `editXxx`
- 删除: `deleteXxx`, `removeXxx`
- 校验: `validateXxx`, `checkXxx`

### 类型命名(驼峰式,自动生成)
- ID 类型: `XxxId`
- 模型: `XxxModel`
- 输入: `XxxInput`
- 搜索: `XxxSearch`

---

## 完整示例对照

参考 `src/base/usr/` 目录:

```
usr/
├── usr.graphql.ts    # GraphQL Schema 定义
├── usr.resolver.ts   # 参数处理、上下文设置
├── usr.service.ts    # 业务逻辑实现
└── usr.dao.ts        # 自定义 DAO(可选)
```

**开发新接口时:**
1. 复制 `usr` 目录作为模板
2. 全局替换 `usr` 为新模块名
3. 修改 GraphQL Schema 定义
4. 根据业务需求修改 Service 逻辑
5. 在 `src/base/graphql.ts` 中注册模块

---

## 最佳实践

### ✅ 推荐做法

1. **分层清晰** - 每层只做该层的事情
2. **错误友好** - 业务错误用中文,便于前端展示
3. **参数校验前置** - 在 Service 层入口校验
4. **使用 validate 函数** - 统一的校验逻辑
5. **动态 import Service** - 避免循环依赖
6. **注释完整** - GraphQL Schema 必须有中文注释
7. **事务标记** - 修改操作记得设置 `context.is_tran = true`

### ❌ 避免的做法

1. 在 GraphQL 层写业务逻辑
2. 在 Resolver 层操作数据库
3. 直接修改 `gen/` 目录代码(除非必要)
4. 手写 DAO 函数(通常不需要)
5. 遗漏事务标记(修改操作)
6. 不写 GraphQL 注释
7. 硬编码魔法值

---

## 快速开发检查清单

创建新接口时,确保完成以下步骤:

- [ ] 在 `src/` 目录创建模块文件夹
- [ ] 创建 `*.graphql.ts` 定义 Schema
- [ ] 创建 `*.resolver.ts` 处理参数
- [ ] 创建 `*.service.ts` 实现逻辑
- [ ] 在对应的 `graphql.ts` 中注册模块
- [ ] GraphQL Schema 添加中文注释
- [ ] 确认接口是否需要登录(默认需要)
- [ ] **修改接口**(增删改)设置 `context.is_tran = true`
- [ ] **查询接口**(只读)不需要设置事务
- [ ] 公开接口设置 `context.notVerifyToken = true`
- [ ] 错误信息使用中文
- [ ] 保存文件后等待 GraphQL Codegen 自动生成类型
- [ ] 启动服务测试接口 (`nr start`)

---

## 附录:依赖导入模板

### GraphQL 层常用导入

```typescript
import { defineGraphql } from "/lib/context.ts";
import * as xxxResolver from "./xxx.resolver.ts";
```

### Resolver 层常用导入

```typescript
import {
  useContext,
} from "/lib/context.ts";

import type {
  QueryGetXxxArgs,
  MutationCreateXxxArgs,
  XxxModel,
  XxxInput,
} from "/gen/types.ts";
```

### Service 层常用导入

```typescript
import {
  get_usr_id,
  get_org_id,
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  findByIdXxx,
  findByIdOkXxx,
  findByIdsOkXxx,
  findOneXxx,
  findAllXxx,
  createXxx,
  createReturnXxx,
  updateByIdXxx,
  deleteByIdsXxx,
  revertByIdsXxx,
  forceDeleteByIdsXxx,
  validateOptionXxx,
  validateIsEnabledXxx,
  findLastOrderByXxx,
} from "/gen/base/xxx/xxx.dao.ts";

import type {
  XxxId,
  XxxInput,
  XxxModel,
  XxxSearch,
} from "/gen/types.ts";
```

---

## 实际案例: getLoginInfo 接口

### 1. GraphQL 定义 (`usr.graphql.ts`)

```typescript
import { defineGraphql } from "/lib/context.ts";
import * as usrResolver from "./usr.resolver.ts";

defineGraphql(usrResolver, /* GraphQL */ `
  
  type GetLoginInfo {
    lbl: String!
    username: String!
    role_codes: [String!]!
    lang: String
    tenant_id: TenantId!
    org_id: OrgId
    org_id_models: [GetLoginInfoOrgIdModels!]!
  }
  
  type Query {
    "获取登录信息"
    getLoginInfo: GetLoginInfo!
  }
  
`);
```

### 2. Resolver 实现 (`usr.resolver.ts`)

```typescript
import {
  useContext,
} from "/lib/context.ts";

export async function getLoginInfo() {
  const {
    getLoginInfo,
  } = await import("./usr.service.ts");
  return await getLoginInfo();
}
```

### 3. Service 实现 (`usr.service.ts`)

```typescript
import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findByIdsRole,
} from "/gen/base/role/role.dao.ts";

import {
  findAllOrg,
} from "/gen/base/org/org.dao.ts";

import type {
  GetLoginInfo,
} from "/gen/types.ts";

export async function getLoginInfo(): Promise<GetLoginInfo> {
  // 1. 获取认证信息
  const authModel = await getAuthModel();
  if (!authModel) {
    throw "未登录";
  }
  
  const tenant_id = authModel.tenant_id;
  const org_id = authModel.org_id;
  const id = authModel.id;
  
  // 2. 查询用户信息
  const usr_model = await findByIdUsr(id);
  if (!usr_model) {
    throw "用户不存在";
  }
  
  // 3. 查询角色信息
  const role_ids = usr_model.role_ids || [];
  const role_models = await findByIdsRole(role_ids);
  const role_codes = role_models.map((item) => item.code);
  
  // 4. 查询组织信息
  const org_ids = usr_model.org_ids || [];
  const orgModels = await findAllOrg();
  const org_id_models: { id: OrgId, lbl: string }[] = [];
  for (let i = 0; i < orgModels.length; i++) {
    const orgModel = orgModels[i];
    if (org_ids.includes(orgModel.id)) {
      org_id_models.push({
        id: orgModel.id,
        lbl: orgModel.lbl,
      });
    }
  }
  
  // 5. 返回结果
  return {
    lbl: usr_model.lbl,
    username: usr_model.username,
    role_codes,
    lang: authModel.lang,
    tenant_id,
    org_id,
    org_id_models,
  };
}
```

---

## 实际案例 2: findMenuAndRoles 接口

### 业务需求
查询菜单及其拥有权限的角色列表(组合查询)

### 1. GraphQL 定义 (`menu.graphql.ts`)

```typescript
import { defineGraphql } from "/lib/context.ts";
import * as menuResolver from "./menu.resolver.ts";

defineGraphql(menuResolver, /* GraphQL */ `
  
  type FindMenuAndRoles {
    menu_model: MenuModel
    role_models: [RoleModel!]!
  }
  
  type Query {
    "查询菜单及其角色信息"
    findMenuAndRoles(
      search: MenuSearch!
    ): FindMenuAndRoles!
  }
  
`);
```

### 2. Resolver 实现 (`menu.resolver.ts`)

```typescript
import type {
  MenuSearch,
  FindMenuAndRoles,
} from "/gen/types.ts";

/**
 * 查询菜单及其角色信息
 */
export async function findMenuAndRoles(
  search: MenuSearch,
): Promise<FindMenuAndRoles> {
  const {
    findMenuAndRoles,
  } = await import("./menu.service.ts");
  // 查询接口,不需要设置 context.is_tran
  // 默认需要登录,不需要设置 context.notVerifyToken
  return await findMenuAndRoles(search);
}
```

### 3. Service 实现 (`menu.service.ts`)

```typescript
import {
  findOneMenu,
} from "/gen/base/menu/menu.dao.ts";

import {
  findAllRole,
} from "/gen/base/role/role.dao.ts";

import type {
  MenuSearch,
  FindMenuAndRoles,
} from "/gen/types.ts";

/**
 * 查询菜单及其角色信息
 */
export async function findMenuAndRoles(
  search: MenuSearch,
): Promise<FindMenuAndRoles> {
  // 1. 根据搜索条件查询菜单
  const menu_model = await findOneMenu(search);
  
  // 2. 查询拥有此菜单权限的角色列表
  const role_models = menu_model
    ? await findAllRole({
        menu_ids: [menu_model.id],
      })
    : [];
  
  // 3. 返回组合结果
  return {
    menu_model,
    role_models,
  };
}
```

### 要点说明

1. **自定义返回类型**: `FindMenuAndRoles` 在 GraphQL Schema 中定义后自动生成到 `types.ts`
2. **条件查询**: 如果菜单不存在,角色列表返回空数组
3. **关联查询**: 通过 `menu_ids` 关联查询拥有该菜单权限的角色
4. **无需事务**: 纯查询操作,不设置 `context.is_tran`
5. **需要登录**: 默认需要登录验证,不设置 `context.notVerifyToken`

---

**最后更新:** 2025-12-01  
**维护者:** 项目开发团队  
**用途:** AI 辅助开发、团队规范参考
