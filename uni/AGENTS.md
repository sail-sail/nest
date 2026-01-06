# Uni - 移动端应用

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/pages/{table}/` | 生成的页面 |
| `src/components/` | 通用组件(不需要import即可全局引用) |

## 生成文件结构

```
src/pages/{table}/
├── Model.ts    # 类型定义
├── List.vue    # 列表页
├── DetailModal.vue # 详情弹窗
├── Dialog.vue  # 新增/编辑页
└── Api.ts      # GraphQL 操作
```
