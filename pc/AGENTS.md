# PC - 电脑端界面

## 目录约定

| 目录 | 说明 |
|------|------|
| `src/views/{mod}/{table}/` | 生成的 CRUD 视图 |
| `src/components/` | 通用组件(不需要import即可全局引用) |

## 生成文件结构

```
src/views/{mod}/{table}/
├── Model.ts    # 类型定义
├── List.vue    # 列表页（搜索/表格/分页）
├── Detail.vue  # 新增/编辑弹窗
├── TreeList.vue  # 树形列表页
├── SelectInput.vue  # 选择输入
├── Api.ts      # GraphQL 操作
└── Api2.ts     # 自定义 GraphQL 接口
```
