# 移动端 Excel 导出功能开发规范

> 本文档定义了移动端 Excel 导出功能的标准开发流程和代码规范  
> 适用场景：uni-app 移动端需要导出 Excel 文件的功能

## 功能架构说明

Excel 导出采用**后端生成**方案：
- 后端使用 Rust + xlsx_handlebars 渲染 Excel 模板
- 前端通过 `uni.downloadFile` 下载并打开文件
- 支持搜索条件、分页、排序参数传递

**技术栈：**
- 后端：Rust + poem + rust_embed + xlsx_handlebars
- 前端：uni-app + TypeScript
- 模板：Excel + Handlebars 语法

---

## 目录结构

```
rust/app/spc/{module}/
├── {module}_model.rs        # 定义 ExportExcelAsset
├── {module}_service.rs       # 实现导出业务逻辑
├── {module}_resful.rs        # 处理 HTTP 请求
├── {module}_router.rs        # 定义路由 handler
└── export_excel_{module}.xlsx  # Excel 模板文件(必须)

rust/main.rs                  # 注册导出路由

uni/src/pages/{module}/
├── Api2.ts                   # 定义导出函数
└── List.vue                  # 添加导出按钮和调用
```

---

## 后端开发流程

### 步骤 1: 在 `{module}_model.rs` 中定义 Asset

**文件路径:** `rust/app/spc/{module}/{module}_model.rs`

**添加代码:**

```rust
#[derive(rust_embed::Embed)]
#[folder = "spc/{module}/"]
#[include = "export_excel_{module}.xlsx"]
pub struct ExportExcel{Module}Asset;
```

**示例 (pt_order):**

```rust
#[derive(rust_embed::Embed)]
#[folder = "spc/pt_order/"]
#[include = "export_excel_pt_order.xlsx"]
pub struct ExportExcelPtOrderAsset;
```

**说明:**
- 使用 `rust_embed` 将 Excel 模板嵌入到二进制文件
- `#[folder]` 指定模板文件所在目录(相对于 `rust/app/`)
- `#[include]` 指定模板文件名(必须遵循命名规范)
- 结构体命名: `ExportExcel{Module}Asset` (驼峰命名)

---

### 步骤 2: 在 `{module}_service.rs` 中实现导出逻辑

**文件路径:** `rust/app/spc/{module}/{module}_service.rs`

**标准模板:**

```rust
use generated::common::gql::model::{
  PageInput,
  SortInput,
};

use generated::spc::{module}::{module}_service;

use generated::spc::{module}::{module}_model::{
  {Module}Search,
};
use super::{module}_model::ExportExcel{Module}Asset;

/// 导出{中文名}
#[allow(unused_variables)]
pub async fn export_excel_{module}(
  search: Option<{Module}Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, String)> {
  
  // 调用 generated service 查询数据(内部自动处理权限过滤)
  let {module}_models = {module}_service::find_all_{module}(
    search,
    page,
    sort,
    options,
  ).await?;
  
  // 读取 Excel 模板文件
  let template_data = ExportExcel{Module}Asset::get("export_excel_{module}.xlsx")
    .ok_or_else(|| eyre!("export_excel_{module}.xlsx not exist!"))?;
  
  let buf = template_data.data.into_owned();
  
  // 使用 xlsx_handlebars 渲染模板
  let buf = xlsx_handlebars::render_template(
    buf,
    &serde_json::json!({
      "{module}_models": {module}_models,
    }),
  ).map_err(|e| eyre!("render_template error: {}", e))?;
  
  // 返回文件内容和文件名
  let filename = "{中文名}.xlsx".to_string();
  
  Ok((buf, filename))
}
```

**示例 (pt_order):**

```rust
use generated::common::gql::model::{
  PageInput,
  SortInput,
};

use generated::spc::pt_order::pt_order_service;

use generated::spc::pt_order::pt_order_model::{
  PtOrderSearch,
};
use super::pt_order_model::ExportExcelPtOrderAsset;

/// 导出生产单
#[allow(unused_variables)]
pub async fn export_excel_pt_order(
  search: Option<PtOrderSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, String)> {
  
  let pt_order_models = pt_order_service::find_all_pt_order(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let template_data = ExportExcelPtOrderAsset::get("export_excel_pt_order.xlsx")
    .ok_or_else(|| eyre!("export_excel_pt_order.xlsx not exist!"))?;
  
  let buf = template_data.data.into_owned();
  
  let buf = xlsx_handlebars::render_template(
    buf,
    &serde_json::json!({
      "pt_order_models": pt_order_models,
    }),
  ).map_err(|e| eyre!("render_template error: {}", e))?;
  
  let filename = "生产单.xlsx".to_string();
  
  Ok((buf, filename))
}
```

**关键点:**
- 调用 `generated` 中的 `find_all_{module}` 获取数据
- 数据查询时会自动应用权限过滤(如企业隔离)
- 模板数据使用 `serde_json::json!` 构造
- 返回 `(Vec<u8>, String)` - 文件内容和文件名

---

### 步骤 3: 在 `{module}_resful.rs` 中处理 HTTP 请求

**文件路径:** `rust/app/spc/{module}/{module}_resful.rs`

**标准模板:**

```rust
use generated::common::gql::model::{
  PageInput,
  SortInput,
};

use generated::spc::{module}::{module}_model::{
  {Module}Search,
};

use super::{module}_service;

/// 导出{中文名}
#[function_name::named]
pub async fn export_excel_{module}(
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
  options: Option<Options>,
) -> Result<Response> {
  
  // 反序列化 search 参数
  let search = if let Some(search_str) = search && !search_str.is_empty() {
    Some(serde_json::from_str::<{Module}Search>(&search_str)?)
  } else {
    None
  };
  
  // 反序列化 page 参数
  let page = if let Some(page_str) = page && !page_str.is_empty() {
    Some(serde_json::from_str::<PageInput>(&page_str)?)
  } else {
    None
  };
  
  // 反序列化 sort 参数
  let sort = if let Some(sort_str) = sort && !sort_str.is_empty() {
    Some(serde_json::from_str::<Vec<SortInput>>(&sort_str)?)
  } else {
    None
  };
  
  // 记录日志
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  // 调用 service 层
  let (buf, filename) = {module}_service::export_excel_{module}(
    search,
    page,
    sort,
    options,
  ).await?;
  
  // URL 编码文件名
  let filename = urlencoding::encode(&filename).to_string();
  
  // 返回 Excel 文件
  Ok(Response::builder()
    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    .header("Content-Disposition", format!("attachment; filename=\"{filename}\""))
    .status(StatusCode::OK)
    .body(buf))
}
```

**关键点:**
- 参数从 URL query string 传入,类型为 `Option<String>`
- 使用 `serde_json::from_str` 反序列化 JSON 字符串
- 使用 `#[function_name::named]` 和 `info!` 记录日志
- 文件名需要 URL 编码以支持中文
- 返回 MIME 类型为 Excel 格式

---

### 步骤 4: 在 `{module}_router.rs` 中定义路由 handler

**文件路径:** `rust/app/spc/{module}/{module}_router.rs`

**在文件开头添加请求参数结构:**

```rust
#[derive(Deserialize)]
struct ExportExcel{Module}Request {
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
}
```

**添加 handler 函数:**

```rust
/// 导出{中文名}
#[handler]
pub async fn export_excel_{module}(
  req: &Request,
  Query(ExportExcel{Module}Request {
    search,
    page,
    sort,
  }): Query<ExportExcel{Module}Request>,
) -> Result<Response> {
  
  Ctx::resful_builder(Some(req))
    .with_auth()?              // 需要登录认证
    .build()
    .resful_scope(async {
      
      let res = {module}_resful::export_excel_{module}(
        search,
        page,
        sort,
        None,
      ).await;
      
      if let Err(err) = res {
        let err_msg = err.to_string();
        error!(err_msg);
        let exception = err.downcast::<ServiceException>().ok();
        let mut response_builder = Response::builder();
        response_builder = response_builder.status(StatusCode::INTERNAL_SERVER_ERROR);
        if let Some(exception) = exception {
          response_builder = response_builder.extension(exception);
        }
        return response_builder.body(err_msg);
      };
      
      res.unwrap()
    }).await
  
}
```

**关键点:**
- 使用 `#[derive(Deserialize)]` 定义请求参数结构
- 使用 `Query` 提取器解析 URL 参数
- `.with_auth()?` 确保用户已登录(JWT 验证)
- 不需要额外的权限判断(如 `{module}_export` 权限)
- 错误处理统一返回 500 状态码

---

### 步骤 5: 在 `main.rs` 中注册路由

**文件路径:** `rust/main.rs`

**在路由注册区域添加:**

```rust
// 导出{中文名}
app = app.at(
  "/api/{module}/export_excel_{module}",
  get(app::spc::{module}::{module}_router::export_excel_{module}),
);
```

**示例 (pt_order):**

```rust
// 导出生产单
app = app.at(
  "/api/pt_order/export_excel_pt_order",
  get(app::spc::pt_order::pt_order_router::export_excel_pt_order),
);
```

**位置参考:**
通常放在其他导出路由附近,如:
- 导出产品
- 导出客户
- 导出生产单 ← 新增
- 导出记工记录

---

### 步骤 6: 准备 Excel 模板文件

**文件路径:** `rust/app/spc/{module}/export_excel_{module}.xlsx`

**模板语法:**
使用 Handlebars 语法访问数据,详见: https://github.com/sail-sail/docx-handlebars

**常用语法示例:**

```handlebars
{{!-- 循环输出数据 --}}
{{#each pt_order_models}}
  {{lbl}}           {{!-- 访问字段 --}}
  {{order_date}}    {{!-- 日期字段 --}}
  {{order_num}}     {{!-- 数字字段 --}}
{{/each}}

{{!-- 条件判断 --}}
{{#if is_verified}}
  已审核
{{else}}
  未审核
{{/if}}

{{!-- 嵌套数据 --}}
{{#each pt_order_models}}
  {{#each pt_order_detail}}
    {{pt_id_lbl}}
    {{qty}}
  {{/each}}
{{/each}}
```

**注意事项:**
1. Excel 模板由人工创建,AI 无法处理
2. 变量名与后端传递的 JSON 数据一致
3. 可以使用 Excel 的样式、公式等功能
4. 模板中可以预设表头、样式等

---

### 步骤 7: 处理 Search 类型的序列化问题

如果 `{Module}Search` 类型没有实现 `Deserialize`,需要手动添加:

**文件路径:** `rust/generated/spc/{module}/{module}_model.rs`

**修改 derive 宏:**

```rust
// 修改前
#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "{Module}Search")]
pub struct {Module}Search {
  // ...
}

// 修改后
#[derive(InputObject, Default, serde::Deserialize, serde::Serialize)]
#[graphql(rename_fields = "snake_case", name = "{Module}Search")]
pub struct {Module}Search {
  // ...
}
```

**为 `#[graphql(skip)]` 字段添加 `#[serde(skip)]`:**

```rust
#[graphql(skip)]
#[serde(skip)]
pub tenant_id: Option<TenantId>,

#[graphql(skip)]
#[serde(skip)]
pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
```

**说明:**
- 需要同时添加 `serde::Deserialize` 和 `serde::Serialize`
- GraphQL 跳过的字段也要让 serde 跳过
- 这些字段通常是内部字段,不需要前端传递

---

## 前端开发流程

### 步骤 1: 在 `Api2.ts` 中定义导出函数

**文件路径:** `uni/src/pages/{module}/Api2.ts`

**标准模板:**

```typescript
import type {
  PageInput,
} from "#/types.ts";

/** 导出{中文名} */
export async function exportExcel{Module}(
  search?: {Module}Search,
  page?: PageInput,
  sort?: Sort[],
) {
  
  const filename = "{中文名}.xlsx";
  
  const indexStore = useIndexStore();
  try {
    indexStore.addLoading();
    
    // 构造请求参数
    const data: {
      search?: string;
      page?: string;
      sort?: string;
    } = { };
    
    if (search) {
      data.search = JSON.stringify(search);
    }
    
    if (page) {
      data.page = JSON.stringify(page);
    }
    
    if (sort) {
      data.sort = JSON.stringify(sort);
    }
    
    // 获取下载 URL
    const url = getRequestUrl({
      url: "{module}/export_excel_{module}",
      data,
    });
    
    // 下载文件
    const res = await uni.downloadFile({
      url,
      filePath: `${ uni.env.USER_DATA_PATH }/${ filename }`,
    });
    
    const statusCode = res.statusCode;
    const filePath = res.filePath;
    
    // 检查下载是否成功
    if (!filePath || statusCode !== 200) {
      uni.showToast({
        title: "{中文名}导出失败",
        icon: "none",
      });
      throw res;
    }
    
    // 提示成功
    uni.showToast({
      title: "{中文名}导出成功",
      icon: "success",
    });
    
    // 打开文件
    await uni.openDocument({
      filePath,
      fileType: "xlsx",
      showMenu: true,
    });
  } finally {
    indexStore.minusLoading();
  }
  
}
```

**示例 (pt_order):**

```typescript
import type {
  PageInput,
} from "#/types.ts";

/** 导出生产单 */
export async function exportExcelPtOrder(
  search?: PtOrderSearch,
  page?: PageInput,
  sort?: Sort[],
) {
  
  const filename = "生产单.xlsx";
  
  const indexStore = useIndexStore();
  try {
    indexStore.addLoading();
    
    const data: {
      search?: string;
      page?: string;
      sort?: string;
    } = { };
    
    if (search) {
      data.search = JSON.stringify(search);
    }
    
    if (page) {
      data.page = JSON.stringify(page);
    }
    
    if (sort) {
      data.sort = JSON.stringify(sort);
    }
    
    const url = getRequestUrl({
      url: "pt_order/export_excel_pt_order",
      data,
    });
    
    const res = await uni.downloadFile({
      url,
      filePath: `${ uni.env.USER_DATA_PATH }/${ filename }`,
    });
    
    const statusCode = res.statusCode;
    const filePath = res.filePath;
    
    if (!filePath || statusCode !== 200) {
      uni.showToast({
        title: "生产单导出失败",
        icon: "none",
      });
      throw res;
    }
    
    uni.showToast({
      title: "生产单导出成功",
      icon: "success",
    });
    
    await uni.openDocument({
      filePath,
      fileType: "xlsx",
      showMenu: true,
    });
  } finally {
    indexStore.minusLoading();
  }
  
}
```

**关键点:**
- 函数名: `exportExcel{Module}` (驼峰命名)
- 参数: `search`, `page`, `sort` (可选)
- 使用 `getRequestUrl` 构造带认证的下载 URL
- 文件保存到 `uni.env.USER_DATA_PATH`
- 使用 `uni.openDocument` 打开下载的文件
- 错误处理和 Loading 状态管理

**`getRequestUrl` 说明:**
- 全局函数,由 `vite.config.mts` 自动导入
- 自动添加 `authorization` 和 `TenantId` 参数
- 自动进行 URL 编码

---

### 步骤 2: 在 `List.vue` 中添加导出按钮和函数

**文件路径:** `uni/src/pages/{module}/List.vue`

**步骤 2.1: 导入导出函数**

在 `<script setup>` 区域添加导入:

```typescript
import {
  // ...其他导入
  exportExcel{Module},
} from "./Api2.ts";
```

**步骤 2.2: 添加导出按钮**

在操作区域(非编辑模式下)添加导出按钮:

```vue
<template
  v-else-if="{module}_models.length > 0"
>
  
  <!-- 导出按钮 -->
  <view
    un-cursor="pointer"
    un-text="[var(--color-primary)]"
    @click="onExportExcel{Module}"
  >
    导出
  </view>
  
  <!-- 原有的操作按钮 -->
  <view
    un-flex="~"
    un-items="center"
    un-gap="x-1"
    un-cursor="pointer"
    @click="isEditing = true"
  >
    <view>操作</view>
    <view un-text="3.5 gray-400">{{ total }}</view>
  </view>
  
</template>
```

**步骤 2.3: 实现导出处理函数**

在删除函数之后添加导出函数:

```typescript
/** 导出{中文名} */
async function onExportExcel{Module}() {
  await exportExcel{Module}(
    getSearch{Module}(),
  );
}
```

**示例 (pt_order):**

```typescript
/** 导出生产单 */
async function onExportExcelPtOrder() {
  await exportExcelPtOrder(
    getSearchPtOrder(),
  );
}
```

**说明:**
- 函数名: `onExportExcel{Module}` (驼峰命名)
- 调用 `getSearch{Module}()` 获取当前搜索条件
- 不传 `page` 和 `sort` 参数(默认导出所有数据)
- 错误处理在 `exportExcel{Module}` 中统一处理

---

## 命名规范总结

### 后端 Rust

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| Asset 结构体 | `ExportExcel{Module}Asset` | `ExportExcelPtOrderAsset` |
| Service 函数 | `export_excel_{module}` | `export_excel_pt_order` |
| Resful 函数 | `export_excel_{module}` | `export_excel_pt_order` |
| Router 函数 | `export_excel_{module}` | `export_excel_pt_order` |
| Request 结构 | `ExportExcel{Module}Request` | `ExportExcelPtOrderRequest` |
| 路由路径 | `/api/{module}/export_excel_{module}` | `/api/pt_order/export_excel_pt_order` |
| Excel 文件 | `export_excel_{module}.xlsx` | `export_excel_pt_order.xlsx` |

### 前端 TypeScript

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| 导出函数 | `exportExcel{Module}` | `exportExcelPtOrder` |
| 事件处理 | `onExportExcel{Module}` | `onExportExcelPtOrder` |
| 文件名 | `{中文名}.xlsx` | `生产单.xlsx` |

**命名原则:**
- 后端使用 `snake_case` (下划线命名)
- 前端使用 `camelCase` (驼峰命名)
- 文件名统一使用小写 + 下划线
- 中文名用于用户界面展示

---

## 常见问题

### Q1: 为什么不使用 GraphQL 导出?

**A:** 移动端导出直接使用 HTTP GET 请求 + `uni.downloadFile`,更简单高效。GraphQL 适合复杂查询,但导出场景更适合简单的 RESTful 接口。

### Q2: 如何处理大数据量导出?

**A:** 
- 后端可以添加分页限制,避免一次性查询过多数据
- Excel 文件本身有行数限制(1048576 行)
- 如果数据量特别大,建议分批导出或使用后台任务

### Q3: 导出失败如何调试?

**A:**
1. 检查后端日志: `info!` 记录的请求参数
2. 检查模板文件是否存在: `export_excel_{module}.xlsx`
3. 检查 `{Module}Search` 是否实现了 `Deserialize`
4. 检查路由是否正确注册
5. 使用浏览器开发工具查看网络请求

### Q4: 模板文件如何制作?

**A:**
1. 创建普通 Excel 文件并设计表格样式
2. 在需要填充数据的单元格使用 Handlebars 语法
3. 参考文档: https://github.com/sail-sail/docx-handlebars
4. 测试模板渲染效果
5. 保存为 `.xlsx` 格式

### Q5: 前端 `getRequestUrl` 是从哪里来的?

**A:** 
`getRequestUrl` 是全局函数,在 `uni/vite.config.mts` 中通过 `unplugin-auto-import` 自动导入:

```typescript
AutoImport({
  imports: [
    {
      "@/utils/request": [
        "getRequestUrl",
        // ...
      ],
    },
  ],
})
```

实际实现在 `uni/src/utils/request.ts` 中。

### Q6: 为什么需要 `.with_auth()?`?

**A:**
- `.with_auth()?` 用于 JWT 认证,确保用户已登录
- 这**不是**权限控制(permission check)
- 导出功能通常不需要额外的权限判断
- 如果需要权限控制,在 Service 层实现

---

## 完整开发检查清单

创建新导出功能时,按照以下顺序检查:

### 后端开发

- [ ] 在 `{module}_model.rs` 添加 `ExportExcel{Module}Asset`
- [ ] 在 `{module}_service.rs` 实现 `export_excel_{module}` 函数
- [ ] 在 `{module}_resful.rs` 实现 `export_excel_{module}` 函数
- [ ] 在 `{module}_router.rs` 定义 `ExportExcel{Module}Request` 和 handler
- [ ] 在 `main.rs` 注册路由 `/api/{module}/export_excel_{module}`
- [ ] 如需要,修改 `{Module}Search` 添加 `Deserialize`
- [ ] 创建 Excel 模板文件 `export_excel_{module}.xlsx`
- [ ] 运行 `cargo check` 检查编译错误

### 前端开发

- [ ] 在 `Api2.ts` 添加 `exportExcel{Module}` 函数
- [ ] 添加必要的类型导入(`PageInput` 等)
- [ ] 在 `List.vue` 导入导出函数
- [ ] 在 `List.vue` 添加导出按钮(非编辑模式)
- [ ] 在 `List.vue` 实现 `onExportExcel{Module}` 函数
- [ ] 测试导出功能是否正常

### 测试验证

- [ ] 编译通过无错误
- [ ] 能正常下载 Excel 文件
- [ ] 文件内容正确显示数据
- [ ] 搜索条件正确应用
- [ ] 错误提示正常显示
- [ ] Loading 状态正常

---

## 参考示例

### 完整示例 1: customer (客户)

**后端文件结构:**
```
rust/app/spc/customer/
├── customer_model.rs          # ExportExcelCustomerAsset
├── customer_service.rs         # export_excel_customer
├── customer_resful.rs          # export_excel_customer
├── customer_router.rs          # export_excel_customer handler
└── export_excel_customer.xlsx  # 模板文件
```

**前端文件结构:**
```
uni/src/pages/customer/
├── Api2.ts      # exportExcelCustomer
└── List.vue     # 导出按钮 + onExportExcelCustomer
```

### 完整示例 2: pt_order (生产单)

**后端文件结构:**
```
rust/app/spc/pt_order/
├── pt_order_model.rs          # ExportExcelPtOrderAsset
├── pt_order_service.rs         # export_excel_pt_order
├── pt_order_resful.rs          # export_excel_pt_order
├── pt_order_router.rs          # export_excel_pt_order handler
└── export_excel_pt_order.xlsx  # 模板文件
```

**前端文件结构:**
```
uni/src/pages/pt_order/
├── Api2.ts      # exportExcelPtOrder
└── List.vue     # 导出按钮 + onExportExcelPtOrder
```

---

## 技术要点

### xlsx_handlebars 库

用于渲染 Excel 模板的 Rust 库:
- 支持 Handlebars 语法
- 保留 Excel 原有样式和格式
- 支持循环、条件、嵌套等语法
- 详见: https://github.com/sail-sail/docx-handlebars

### rust_embed 库

用于将静态文件嵌入二进制:
- 编译时将文件内容嵌入程序
- 支持文件夹和文件过滤
- 零运行时开销

### uni.downloadFile API

uni-app 的文件下载 API:
- 自动处理跨平台文件存储
- 支持 H5、小程序、App
- `uni.env.USER_DATA_PATH` 是用户文档目录

### uni.openDocument API

打开文件的 uni-app API:
- 支持多种文件类型(xlsx, pdf 等)
- 调用系统应用打开文件
- `showMenu: true` 显示分享等菜单

---

## 附录:依赖导入模板

### 后端导入

**Service 层:**
```rust
use color_eyre::eyre::{Result, eyre};
use generated::common::context::Options;
use generated::common::gql::model::{PageInput, SortInput};
use generated::spc::{module}::{module}_service;
use generated::spc::{module}::{module}_model::{Module}Search;
use super::{module}_model::ExportExcel{Module}Asset;
```

**Resful 层:**
```rust
use color_eyre::eyre::Result;
use tracing::info;
use poem::Response;
use http::status::StatusCode;
use generated::common::context::{Options, get_req_id};
use generated::common::gql::model::{PageInput, SortInput};
use generated::spc::{module}::{module}_model::{Module}Search;
use super::{module}_service;
```

**Router 层:**
```rust
use color_eyre::eyre::Result;
use serde::Deserialize;
use tracing::error;
use poem::{Request, Response, handler, web::Query};
use http::status::StatusCode;
use generated::common::context::Ctx;
use generated::common::exceptions::service_exception::ServiceException;
use super::{module}_resful;
```

### 前端导入

**Api2.ts:**
```typescript
import type {
  PageInput,
} from "#/types.ts";
```

**List.vue:**
```typescript
import {
  exportExcel{Module},
} from "./Api2.ts";
```

---

**文档版本:** v1.0  
**最后更新:** 2025-12-02  
**用途:** AI 辅助开发、团队规范参考
