# DAO 函数参考

从 `gen/{mod}/{table}/{table}.dao.ts` 导入

## 查询函数

| 函数 | 用途 | 返回值 |
|------|------|--------|
| `findByIdXxx(id)` | ID查询 | `Model \| undefined` |
| `findByIdOkXxx(id)` | ID查询, 不存在抛异常 | `Model` |
| `findByIdsXxx(ids)` | 多ID查询, 返回存在的记录 | `Model[]` |
| `findByIdsOkXxx(ids)` | 多ID查询, 必须全部存在且顺序一致 | `Model[]` |
| `findOneXxx(search)` | 条件查单条 | `Model \| undefined` |
| `findOneOkXxx(search)` | 条件查单条, 不存在抛异常 | `Model` |
| `findAllXxx(search, page, sort)` | 条件查列表 | `Model[]` |
| `findCountXxx(search)` | 查询数量 | `number` |

## 创建/更新/删除

| 函数 | 用途 | 返回值 |
|------|------|--------|
| `createXxx(input)` | 创建 | `XxxId` |
| `createReturnXxx(input)` | 创建并立即查询返回 | `Model` |
| `createsXxx(inputs)` | 批量创建 | `XxxId[]` |
| `createsReturnXxx(inputs)` | 批量创建并返回 | `Model[]` |
| `updateByIdXxx(id, input)` | 更新 | `XxxId` |
| `updateByIdReturnXxx(id, input)` | 更新并立即查询返回 | `Model` |
| `deleteByIdsXxx(ids)` | 逻辑删除 | `number` |
| `revertByIdsXxx(ids)` | 恢复删除 | `number` |
| `forceDeleteByIdsXxx(ids)` | 物理删除（慎用）| `number` |

## 校验函数

| 函数 | 用途 |
|------|------|
| `validateOptionXxx(model)` | model 为 undefined 时抛异常 |
| `validateIsEnabledXxx(model)` | model 被禁用时抛异常 |

## Search 对象

```typescript
{
  id?: XxxId,              // 精确匹配
  ids?: XxxId[],           // ID 列表范围查询
  lbl?: string,            // 精确匹配
  lbl_like?: string,       // 模糊查询
  xxx_is_null?: boolean,   // 判断字段是否为空
  is_deleted?: 0 | 1,      // 软删除标记（默认 0）
}
```

## 分页与排序

分页和排序是 `findAllXxx` 的**独立参数**，不在 Search 对象中：

```typescript
import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

// 完整签名
findAllXxx(search, page, sort)

// 带分页
const models = await findAllXxx(
  { lbl_like: "test" },
  { pgOffset: 0, pgSize: 10 },
);

// 带排序
const models = await findAllXxx(
  { lbl_like: "test" },
  undefined,
  [{ prop: "create_time", order: "descending" }],
);

// 不分页不排序
const models = await findAllXxx(
  { lbl_like: "test" },
);
```
