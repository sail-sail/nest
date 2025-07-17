# Nest - 全栈代码生成系统

基于数据库模式定义的多端全栈应用，自动生成 GraphQL API、前端组件和数据库模式。

## 架构概览

### 四模块结构
- **`deno/`** - 使用 Deno 运行时和 Oak 框架的 GraphQL API 服务器
- **`pc/`** - Vue 3 + Element Plus 桌面/Web 管理界面
- **`uni/`** - Uni-app 跨平台移动应用（微信小程序、H5、APP）
- **`codegen/`** - 代码生成引擎，创建所有 CRUD 操作和 UI 组件

### 代码生成工作流

整个系统由 `codegen/src/tables/` 中的数据库模式定义驱动：

```bash
# 从模式定义生成所有代码
cd codegen && npm run codegen

# 将生成的代码应用到目标项目
cd codegen && npm run codeapply
```

**核心模式**：永远不要手动创建 CRUD 操作。始终在 `codegen/src/tables/[module]/[module].ts` 中使用 `defineConfig()` 模式定义模式，然后生成。

### GraphQL 模式生成

GraphQL 类型、解析器和服务都从表定义自动生成：

- **模式**：`deno/gen/[module]/[table]/[table].graphql.ts` - 生成带中文注释的 GraphQL 模式
- **解析器**：`deno/gen/[module]/[table]/[table].resolver.ts` - 生成 CRUD 解析器
- **模型**：`deno/gen/[module]/[table]/[table].model.ts` - TypeScript 接口
- **服务**：`deno/gen/[module]/[table]/[table].service.ts` - 数据库操作

GraphQL 端点自动包含：
- `findAll[Table]` - 带分页/过滤的列表查询
- `findById[Table]` - 单记录获取
- `create[Table]` - 创建操作
- `update[Table]` - 更新操作
- `delete[Table]` - 软删除操作

### 前端生成模式

PC 端和 Uni-app 前端都生成完整的 CRUD 界面：

**PC 端（Vue 3 + Element Plus）**：
- `pc/src/views/[module]/[table]/List.vue` - 主列表视图，带搜索/过滤
- `pc/src/views/[module]/[table]/Dialog.vue` - 创建/编辑模态框
- `pc/src/views/[module]/[table]/Api.ts` - GraphQL 客户端操作

**Uni-app**：
- `uni/src/pages/[table]/List.vue` - 移动端优化的列表视图
- `uni/src/pages/[table]/Dialog.vue` - 移动端表单界面
- `uni/src/pages/[table]/Api.ts` - 移动端 GraphQL 客户端

### 表配置模式

在 `codegen/src/tables/[module]/[module].ts` 中：

```typescript
export default defineConfig({
  [module]_[table]: {
    opts: {
      cache: true,           // 启用缓存
      list_tree: true,       // 生成树形视图
      uniques: [["code"]],   // 唯一约束
    },
    columns: [
      {
        COLUMN_NAME: "code",
        autoCode: {            // 自动生成编码
          prefix: "USR",
          seq: "code_seq", 
        },
      },
      {
        COLUMN_NAME: "role_ids",
        foreignKey: {          // 多对多关系
          table: "role",
          multiple: true,
          showType: "dialog",
        },
      },
    ],
  },
});
```

### 开发命令

**后端（Deno）**：
```bash
cd deno
npm run start                    # 启动开发服务器
npm run build-prod              # 生产构建
npm run gqlgen                  # 重新生成 GraphQL 类型
```

**前端（PC）**：
```bash
cd pc  
npm run start                   # 开发服务器
npm run build-prod             # 生产构建
npm run typecheck              # 类型检查
```

**前端（Uni-app）**：
```bash
cd uni
npm run dev:mp-weixin          # 微信小程序开发
npm run build-prod            # 生产构建
npm run dev:h5                # H5 开发
```

### 核心约定

- **表命名**：`[module]_[table]` 格式（如 `base_usr`、`base_role`）
- **ID 类型**：每个表都有类型化的 ID 标量（GraphQL 中的 `UsrId`、`RoleId`）
- **标签约定**：`lbl` 字段用于显示名称，`_lbl` 后缀用于外键标签
- **软删除**：使用 `is_deleted` 标志，永不硬删除
- **审计字段**：自动添加 `create_usr_id`、`create_time`、`update_usr_id`、`update_time`
- **多租户**：当存在时自动处理 `tenant_id` 和 `org_id`

### 外键模式

外键自动生成选择组件和验证：
- `user_id` → 生成用户选择器，带 `user_id_lbl` 用于显示
- `role_ids` → 生成多选用于多对多关系
- 树形关系使用 `parent_id` 指向同一表

### 环境与构建

- **Deno**：使用 `lib/env.ts` 进行环境配置
- **PC**：Vite + UnoCSS + Vue 3 组合式 API
- **Uni-app**：跨平台条件编译
- **数据库**：MySQL，通过 `information_schema` 进行模式内省

系统强调约定优于配置 - 遵循生成代码中的既定模式，而不是创建自定义实现。
