# 前端自定义 API 接口开发规范

> 本文档定义了前端自定义 GraphQL API 接口的标准开发流程和代码规范

## 目录结构说明

```
pc/src/views/{module}/{table}/
├── Api.ts      # 自动生成的代码(尽量不修改)
└── Api2.ts     # 手写代码(自定义接口)
```

**重要原则:**
- `Api.ts` 由工具根据后端 GraphQL Schema 自动生成,除非必要否则不要修改
- `Api2.ts` 用于调用后端自定义接口(非标准 CRUD 的业务接口)
- 后端接口开发完成并重启服务后,会自动生成类型到 `#/types.ts`

---

## 标准接口模板

### 1. Query 查询接口

**职责:** 调用后端 Query 类型的查询接口

**标准模板:**

```typescript
import type {
  Query,
} from "#/types.ts";

/**
 * 接口描述(必须写注释)
 */
export async function getXxxData(
  param1: Type1,
  param2: Type2,
  opt?: GqlOpt,
) {
  
  const res: {
    getXxxData: Query["getXxxData"];
  } = await query({
    query: /* GraphQL */ `
      query($param1: Type1!, $param2: Type2!) {
        getXxxData(param1: $param1, param2: $param2) {
          field1
          field2
        }
      }
    `,
    variables: {
      param1,
      param2,
    },
  }, opt);
  
  const data = res.getXxxData;
  
  return data;
}
```

**关键点:**
- 使用 `Query` 类型声明返回值
- GraphQL 查询字符串使用 `` /* GraphQL */ ` `` 标记
- 变量名与参数名保持一致
- 返回 `data` 而不是 `res`

---

### 2. Mutation 修改接口

**职责:** 调用后端 Mutation 类型的修改接口

**标准模板:**

```typescript
import type {
  Mutation,
} from "#/types.ts";

/**
 * 接口描述(必须写注释)
 */
export async function updateXxxData(
  id: XxxId,
  input: XxxInput,
  opt?: GqlOpt,
) {
  
  const res: {
    updateXxxData: Mutation["updateXxxData"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: XxxId!, $input: XxxInput!) {
        updateXxxData(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  
  const data = res.updateXxxData;
  
  return data;
}
```

**关键点:**
- 使用 `Mutation` 类型声明返回值
- Mutation 通常返回简单类型(如 ID、数量、布尔值等)
- `opt` 参数可选,用于控制 loading、错误提示等行为

---

## 类型导入规范

### 1. 从 `#/types.ts` 导入类型

后端接口开发完成并重启服务后,所有类型会自动生成到 `#/types.ts`:

```typescript
import type {
  Query,                          // 所有 Query 接口的类型定义
  Mutation,                       // 所有 Mutation 接口的类型定义
  GetwxacodeunlimitInput,         // 后端定义的 Input 类型
  SaveProcessRecordPtOrderInput,  // 自定义 Input 类型
} from "#/types.ts";
```

**类型说明:**
- `Query` - 包含所有后端 Query 接口的返回类型
- `Mutation` - 包含所有后端 Mutation 接口的返回类型
- `XxxInput` - 后端定义的输入类型
- `XxxModel` - 后端定义的模型类型(通常已在全局声明)
- `XxxSearch` - 后端定义的搜索类型(通常已在全局声明)

---

## 完整示例

### 示例 1: 生成小程序码(简单 Mutation)

```typescript
import type {
  Mutation,
  GetwxacodeunlimitInput,
} from "#/types.ts";

/** 生成记工小程序码 */
export async function genWxQrPtOrder(
  pt_order_id: PtOrderId,
  input: GetwxacodeunlimitInput,
  opt?: GqlOpt,
) {
  
  const res: {
    genWxQrPtOrder: Mutation["genWxQrPtOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($pt_order_id: PtOrderId!, $input: GetwxacodeunlimitInput!) {
        genWxQrPtOrder(pt_order_id: $pt_order_id, input: $input)
      }
    `,
    variables: {
      pt_order_id,
      input,
    },
  }, opt);
  
  const data = res.genWxQrPtOrder;
  
  return data;
}
```

### 示例 2: 批量审核(返回数量)

```typescript
import type {
  Mutation,
} from "#/types.ts";

/** 审核通过 - 批量操作 */
export async function verifyBatchPtOrder(
  pt_order_ids: PtOrderId[],
  opt?: GqlOpt,
) {
  
  const res: {
    verifyBatchPtOrder: Mutation["verifyBatchPtOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($pt_order_ids: [PtOrderId!]!) {
        verifyBatchPtOrder(pt_order_ids: $pt_order_ids)
      }
    `,
    variables: {
      pt_order_ids,
    },
  }, opt);
  
  const data = res.verifyBatchPtOrder;
  
  return data;
}
```

### 示例 3: 查询复杂数据(Query)

```typescript
import type {
  Query,
} from "#/types.ts";

import {
  menuFields,
} from "@/views/base/menu/Model.ts";

/**
 * 查询菜单及其角色信息
 */
export async function findMenuAndRoles(
  search: MenuSearch,
  opt?: GqlOpt,
) {
  const res: {
    findMenuAndRoles: Query["findMenuAndRoles"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch!) {
        findMenuAndRoles(search: $search) {
          menu_model {
            ${ menuFields.join(" ") }
          }
          role_models {
            id
            lbl
          }
        }
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const data = res.findMenuAndRoles;
  
  return data;
}
```

### 示例 4: 设置密码(简单 Mutation)

```typescript
import type {
  Mutation,
  SetTenantAdminPwdInput,
} from "#/types.ts";

/** 设置租户管理员密码 */
export async function setTenantAdminPwd(
  input?: SetTenantAdminPwdInput,
  opt?: GqlOpt,
) {
  const res: {
    setTenantAdminPwd: Mutation["setTenantAdminPwd"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: SetTenantAdminPwdInput!) {
        setTenantAdminPwd(input: $input)
      }
    `,
    variables: {
      input,
    },
  }, opt);
  
  const data = res.setTenantAdminPwd;
  
  return data;
}
```

---

## GraphQL 查询字段说明

### 1. 使用 Model.ts 中的字段定义

当需要查询完整的模型字段时,可以引用 `Model.ts` 中定义的字段数组:

```typescript
import {
  menuFields,
} from "@/views/base/menu/Model.ts";

// 在 GraphQL 查询中使用
query: /* GraphQL */ `
  query {
    findAllMenu {
      ${ menuFields.join(" ") }
    }
  }
`
```

### 2. 手动指定字段

对于简单查询或特定字段,直接在 GraphQL 中列出:

```typescript
query: /* GraphQL */ `
  query {
    getCurrentUser {
      id
      username
      nickname
      avatar
    }
  }
`
```

---

## 命名约定

### 函数命名(驼峰式)
- 前端使用驼峰命名: `genWxQrPtOrder`
- 对应后端蛇形命名: `gen_wx_qr_pt_order`
- GraphQL 查询中使用驼峰: `genWxQrPtOrder`

### 参数命名
- GraphQL 变量使用蛇形: `$pt_order_id`
- TypeScript 参数使用蛇形: `pt_order_id`
- 保持前后端一致性

---

## GqlOpt 选项说明

`opt?: GqlOpt` 参数用于控制请求行为:

```typescript
interface GqlOpt {
  notLoading?: boolean;    // 不显示 loading
  showErrMsg?: boolean;    // 是否显示错误消息
  // ... 其他选项
}

// 使用示例
await genWxQrPtOrder(
  id,
  input,
  {
    notLoading: true,      // 静默请求
  }
);
```

---

## 开发流程

1. **后端开发接口**
   - 在 `rust/app/` 中开发自定义接口
   - 遵循后端开发规范(参考 `rust-graphql-guide.md`)

2. **重启后端服务**
   - 后端服务重启后自动生成 GraphQL Schema
   - 类型自动同步到前端 `#/types.ts`

3. **前端调用接口**
   - 在 `Api2.ts` 中创建接口函数
   - 从 `#/types.ts` 导入类型
   - 编写 GraphQL 查询/变更
   - 添加函数注释

4. **类型检查**
   - TypeScript 会自动检查类型是否匹配
   - 确保 GraphQL 查询字段与类型一致

---

## 最佳实践

### ✅ 推荐做法

1. **类型安全** - 始终使用 `Query` 或 `Mutation` 类型
2. **注释完整** - 每个函数必须有清晰的注释
3. **错误处理** - 合理使用 `opt` 参数控制错误提示
4. **代码简洁** - 保持函数结构清晰,避免复杂逻辑
5. **命名一致** - 函数名与后端接口名保持对应关系

### ❌ 避免的做法

1. 不要在 `Api2.ts` 中处理复杂的业务逻辑
2. 不要跳过类型声明(使用 `any`)
3. 不要修改 `Api.ts` 中的自动生成代码
4. 不要遗漏 GraphQL 查询的必需字段
5. 不要忘记添加函数注释

---

## 常见场景

### 1. 批量操作接口

```typescript
/** 批量删除 */
export async function deleteByIdsXxx(
  ids: XxxId[],
  opt?: GqlOpt,
) {
  const res: {
    deleteByIdsXxx: Mutation["deleteByIdsXxx"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [XxxId!]!) {
        deleteByIdsXxx(ids: $ids)
      }
    `,
    variables: { ids },
  }, opt);
  
  return res.deleteByIdsXxx;
}
```

### 2. 带复杂 Input 的接口

```typescript
/** 保存记工记录 */
export async function saveProcessRecord(
  input: SaveProcessRecordInput,
  opt?: GqlOpt,
) {
  const res: {
    saveProcessRecord: Mutation["saveProcessRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: SaveProcessRecordInput!) {
        saveProcessRecord(input: $input)
      }
    `,
    variables: { input },
  }, opt);
  
  return res.saveProcessRecord;
}
```

### 3. 返回自定义类型的 Query

```typescript
/** 获取薪资报表 */
export async function getSalaryReport(
  search?: SalaryReportSearch,
  opt?: GqlOpt,
) {
  const res: {
    getSalaryReport: Query["getSalaryReport"];
  } = await query({
    query: /* GraphQL */ `
      query($search: SalaryReportSearch) {
        getSalaryReport(search: $search) {
          employee_id
          employee_name
          total_amount
          record_count
        }
      }
    `,
    variables: { search },
  }, opt);
  
  return res.getSalaryReport;
}
```

---

## 快速开发检查清单

创建新接口时,确保完成以下步骤:

- [ ] 后端接口已开发完成并重启服务
- [ ] 类型已自动生成到 `#/types.ts`
- [ ] 在 `Api2.ts` 中创建接口函数
- [ ] 从 `#/types.ts` 正确导入类型
- [ ] 编写完整的 GraphQL 查询/变更
- [ ] 使用 `Query` 或 `Mutation` 声明返回值类型
- [ ] 添加清晰的函数注释
- [ ] 参数命名与后端保持一致
- [ ] 返回处理后的 `data` 而不是 `res`
- [ ] TypeScript 类型检查通过

---

## 附录:导入模板

```typescript
// 基础类型导入
import type {
  Query,
  Mutation,
} from "#/types.ts";

// 自定义输入类型
import type {
  XxxInput,
  YyySearch,
} from "#/types.ts";

// 引用 Model 字段(如需完整查询)
import {
  xxxFields,
} from "@/views/{module}/{table}/Model.ts";
```

---

**用途:** AI 辅助开发、团队规范参考、新人上手指南
