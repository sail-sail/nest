---
name: deno-graphql-backend
description: Deno GraphQL 后端接口的完整开发指南. 当需要创建、修改后端 API 接口时使用
---

# GraphQL 接口开发

## 分层架构

| 层 | 文件 | 职责 |
|----|------|------|
| GraphQL | `{table}.graphql.ts` | 接口定义 |
| Model | `{table}.model.ts` | 输入输出类型(可选, 给各层函数用的类型定义) |
| Resolver | `{table}.resolver.ts` | 参数解构/事务/认证设置 |
| Service | `{table}.service.ts` | 业务逻辑 |
| DAO | `{table}.dao.ts` | 数据库操作(一般无需手动改动, 已自动生成常用 DAO 函数) |

## GraphQL 层

```typescript
import { defineGraphql } from "/lib/context.ts";
import * as resolver from "./{table}.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

  type {Table}Model {
    id: {Table}Id!
    lbl: String!
  }

  input {Table}Input {
    lbl: String!
  }

  input {Table}Search {
    lbl: String
  }

  type Query {
    "接口描述"
    methodName(param_name: ParamType!): ReturnType!
  }

  type Mutation {
    "修改操作"
    mutateMethod(input: {Table}Input!): {Table}Id!
  }
`);
```

## Resolver 层

```typescript
import {
  useContext,
} from "/lib/context.ts";

// 查询 - 不需要事务
export async function methodName(
  param: ParamType,
) {

  const {
    methodName,
  } = await import("./{table}.service.ts");

  return await methodName(param);
}

// 修改 - 需要事务
export async function mutateMethod(
  input: {Table}Input,
) {

  const {
    mutateMethod,
  } = await import("./{table}.service.ts");

  const context = useContext();
  context.is_tran = true; // 修改需事务

  return await mutateMethod(input);
}

// 公开接口 - 不验证 token
export async function publicApi() {

  const {
    publicApi,
  } = await import("./{table}.service.ts");

  const context = useContext();
  context.notVerifyToken = true; // 不验证token

  return await publicApi();
}
```

## Service 层

```typescript
import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdOkXxx,
  findOneOkXxx,
  findAllXxx,
  createXxx,
  updateByIdXxx,
} from "/gen/{mod}/{table}/{table}.dao.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  {Table}Id,
  {Table}Input,
  {Table}Search,
} from "/gen/types.ts";

export async function methodName(
  param: ParamType,
) {

  if (isEmpty(param)) {
    throw "参数不能为空";
  }

  const usr_id = await get_usr_id(false);

  const {table}_model = await findOneOkXxx(
    {
      field: param,
    },
  );

  const {table}_models = await findAllXxx(
    {
      field: param,
    },
    {
      pgOffset: 0,
      pgSize: 10,
    }, // 不分页则传入 undefined 即可
    [
      {
        prop: "create_time",
        order: "descending",
      },
    ], // 一般无需排序参数传入 undefined 即可, 建表时已加默认排序
  );

  // 业务操作, 业务操作过程中如果不清楚表结构则可以到这里查看表结构 `codegen/src/tables/{mod}/{mod}.sql`, `codegen/src/tables/{mod}/{mod}.ts`
  // 注意: 业务逻辑开发过程中, 不需要写太多注释, 关键位置写一点业务注释即可

  return {table}_models;
}
```

- 已有表的 Model/Input/Search 不要重复定义
- {Table}Id, {Table}Input, {Table}Search 无需import可直接使用, 自动生成在 `{table}.model.ts` 中全局 `declare global { }` 类型定义
- 主动抛出业务异常 ServiceException(message?: string, code?: string, _rollback?: boolean, _showStack = false) `lib/exceptions/service.exception.ts`: _rollback 是否回滚事务, 默认为 true, _showStack 是否打印堆栈信息, 默认为 false

- 如需操作附件, 则使用 [oss.dao.ts](../../../lib/oss/oss.dao.ts) 提供的函数进行操作

- 函数定义和调用时, 多个参数时要换行

## 注册模块

在 `src/{mod}/graphql.ts` 添加：
```typescript
import "./{table}/{table}.graphql.ts";
```

## 常用 DAO 函数

从 `gen/{mod}/{table}/{table}.dao.ts` 导入

| 函数 | 用途 |
|------|------|
| `findByIdXxx` | ID查询 （不存在则返回undefined）|
| `findByIdOkXxx` | ID查询（必存在否则抛异常）|
| `findByIdsXxx` | 多ID查询 → `Model[]` |
| `findByIdsOkXxx` | 多ID查询（必存在且顺序跟ids一致）|
| `findOneXxx` | 条件查单条 |
| `findOneOkXxx` | 条件查单条（必存在）|
| `findAllXxx` | 条件查列表 包括搜索条件, 分页, 排序参数 |
| `findCountXxx` | 查询数量 |
| `createXxx` | 创建 → ID |
| `createReturnXxx` | 创建 → 立即查询返回完整记录 |
| `updateByIdXxx` | 更新 |
| `updateByIdReturnXxx` | 更新 → 立即查询返回完整记录 |
| `deleteByIdsXxx` | 逻辑删除 |
| `revertByIdsXxx` | 恢复删除 |
| `forceDeleteByIdsXxx` | 彻底删除（慎用）|
| `validateOptionXxx` | 校验 undefined 时抛异常 |
| `validateIsEnabledXxx` | 校验禁用时抛异常 |

## 辅助函数

```typescript
import {
  get_usr_id,      // 当前用户ID, get_usr_id(false) 必须登录
  get_org_id,      // 当前组织ID
  getAuthModel,    // 获取完整认证信息
} from "/lib/auth/auth.dao.ts";

import {
  shortUuidV4,    // 生成短UUID
  isEmpty,        // 判断字符串为空
  isNotEmpty,     // 判断字符串不为空
} from "/lib/util/string_util.ts";

import {
  useContext,      // 获取请求上下文
} from "/lib/context.ts";
```

## 详细参考

- [DAO 函数](references/dao.md) - 查询/创建/更新/删除函数详细说明
- [认证权限](references/auth.md) - 用户获取、权限检查、数据隔离
- [架构约定](references/architecture.md) - 目录结构、命名规范
