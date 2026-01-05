# DAO 函数参考

从 `gen/{module}/{table}/{table}.dao.ts` 导入

## 查询

```typescript
findByIdXxx(id)           // Model | undefined
findByIdOkXxx(id)         // Model，不存在抛异常
findByIdsXxx(ids)         // 返回存在的记录
findByIdsOkXxx(ids)       // 全部存在，按顺序返回
findOneXxx(search)        // 第一条
findAllXxx(search)        // 列表
findCountXxx(search)      // 数量
```

## 创建/更新/删除

```typescript
createXxx(input)          // 返回 ID
createReturnXxx(input)    // 返回完整记录
updateByIdXxx(id, input)  // 返回影响行数
deleteByIdsXxx(ids)       // 逻辑删除
revertByIdsXxx(ids)       // 恢复删除
forceDeleteByIdsXxx(ids)  // 物理删除（慎用）
```

## 校验

```typescript
validateOptionXxx(model)     // undefined 时抛异常
validateIsEnabledXxx(model)  // 禁用时抛异常
```

## Search 对象

```typescript
{
  id?: XxxId,           // 精确匹配
  ids?: XxxId[],        // ID 列表范围查询
  lbl?: string,         // 精确匹配
  lbl_like?: string,    // 模糊查询
  xxx_is_null?: boolean,// 判断字段是否为空
  is_deleted?: 0 | 1,   // 软删除标记（默认 0）
}
```

## 分页与排序

分页和排序是**独立参数**，不在 Search 对象中：

```typescript
findAllXxx(search, page, sort)

// PageInput
{ page?: number, limit?: number }

// SortInput[]
[{ prop: "create_time", order: "descending" }]
```
