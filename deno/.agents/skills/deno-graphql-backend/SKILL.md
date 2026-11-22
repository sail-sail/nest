---
name: deno-graphql-backend
description: 开发或修改 Deno GraphQL 后端接口时使用
---

# GraphQL 接口开发

新接口必须放在 `src/`；`gen/` 是生成代码。按 GraphQL 定义 -> Resolver 转发 -> Service 业务处理 -> 模块注册的顺序开发。

## 必须遵守

- GraphQL 定义变更后执行 `npm run gqlgen`，同步后端、PC 和 Uni 类型。
- 修改完成后执行 `npm run typecheck`；不要用 `deno check` 代替。
- 每层只承担自身职责，复用现有类型和生成 DAO，不重复实现。

## 分层架构

| 层 | 文件 | 职责 |
|----|------|------|
| GraphQL | `{table}.graphql.ts` | 接口定义 |
| Model | `{table}.model.ts` | 自定义类型（可选） |
| Resolver | `{table}.resolver.ts` | 参数转发/事务/认证 |
| Service | `{table}.service.ts` | 业务逻辑 |
| DAO | `{table}.dao.ts` | 数据库操作（通常由生成代码提供） |

## GraphQL 层

只定义类型及 Query/Mutation 签名，不写业务逻辑；已有的 Model/Input/Search 不要重复定义。类型、字段和接口注释要清楚说明业务含义。

```typescript
import { defineGraphql } from "/lib/context.ts";
import * as resolver from "./{table}.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
  "业务查询结果"
  type MethodModel {
    "名称"
    lbl: String!
  }

  "业务输入"
  input MethodInput {
    "名称"
    lbl: String!
  }

  type Query {
    "查询接口用途"
    methodName(id: {Table}Id!): MethodModel!
  }

  type Mutation {
    "修改接口用途"
    mutateMethod(input: MethodInput!): {Table}Id!
  }
`);
```

## Resolver 层

只做参数转发、延迟导入、事务和认证设置；不要在这里写业务逻辑。

```typescript
import {
  set_is_tran,
  useContext,
} from "/lib/context.ts";

import type {
  MethodInput,
} from "/gen/types.ts";

export async function methodName(
  id: {Table}Id,
) {
  const {
    methodName,
  } = await import("./{table}.service.ts");

  return await methodName(id);
}

export async function mutateMethod(
  input: MethodInput,
) {
  const {
    mutateMethod,
  } = await import("./{table}.service.ts");

  set_is_tran(true);

  return await mutateMethod(input);
}

export async function publicApi() {
  const context = useContext();
  context.notVerifyToken = true;
  const {
    publicApi,
  } = await import("./{table}.service.ts");

  return await publicApi();
}
```

- 增删改或包含多步数据库写入的接口在 Resolver 设置事务；纯查询不要开启。
- 默认接口需要登录。仅公开接口设置 `notVerifyToken = true`。

## Service 层

只处理参数校验、认证数据获取、DAO 调用和业务编排。

```typescript
import "/gen/{mod}/{table}/{table}.model.ts";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdOkXxx,
} from "/gen/{mod}/{table}/{table}.dao.ts";

export async function methodName(
  id: {Table}Id,
) {
  if (!id) {
    throw new ServiceException("参数不能为空");
  }

  const usr_id = await get_usr_id(false);
  const model = await findByIdOkXxx(id);

  if (model.create_usr_id !== usr_id) {
    throw new ServiceException("无权访问");
  }

  return model;
}
```

- 表的 `{Table}Id`、`{Table}Model`、`{Table}Input`、`{Table}Search` 由 `{table}.model.ts` 声明为全局类型；先以副作用方式导入该文件，无需再逐项 `import type`。
- GraphQL 自定义类型、`PageInput`、`SortInput` 等从 `/gen/types.ts` 按需导入类型。
- DAO 预期必须存在数据时优先使用 `findByIdOkXxx`、`findOneOkXxx`；返回结果不符合预期时，记录关键入参和结果后明确抛错，不要静默跳过。
- 普通业务提示可沿用 `throw await ns(...)`；需要错误码、回滚控制或隐藏堆栈时使用 `ServiceException`。
- 附件操作统一使用 [oss.dao.ts](../../../lib/oss/oss.dao.ts)。
- 表配置了 `modelLabel` 时，create/update 同时维护对应的 `xxx_id_lbl`。

## 注册模块

在 `src/{mod}/graphql.ts` 添加：
```typescript
import "./{table}/{table}.graphql.ts";
```

## 常用 DAO 函数

从 `gen/{mod}/{table}/{table}.dao.ts` 导入。分页与排序是 `findAllXxx(search, page, sort)` 的独立参数；完整函数签名和返回值见 [DAO 函数](references/dao.md)。

## 详细参考

- [DAO 函数](references/dao.md) - 查询/创建/更新/删除函数详细说明
- [认证权限](references/auth.md) - 用户获取、权限检查、数据隔离
- [架构约定](references/architecture.md) - 目录结构、命名规范
