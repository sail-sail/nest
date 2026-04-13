---
name: sub-package
description: 微信小程序分包（subPackages）配置。需要将页面拆分到子包时使用
compatibility: Uni-app 微信小程序
metadata:
  version: "1.0"
---

# 微信小程序分包（subPackages）

将 `src/pages.json` 中的页面从主包拆分到子包，减小主包体积。

## 操作步骤

1. 从 `pages` 数组中**移除**要拆包的页面
2. 在 `subPackages` 数组中添加子包配置（若数组不存在则创建）
3. 页面路径需要转换：去掉目录前缀，只保留文件名

## 格式说明

```jsonc
// 拆包前 - pages 数组中
{
  "path": "pages/agreement/UserAgreement",
  "style": { "navigationBarTitleText": "用户协议" }
}

// 拆包后 - subPackages 数组中
{
  "root": "pages/agreement",   // 子包根目录
  "name": "agreement",         // 子包名称（取目录名）
  "pages": [
    {
      "path": "UserAgreement", // 仅文件名，不含目录前缀
      "style": { "navigationBarTitleText": "用户协议" }
    }
  ]
}
```

## 规则

- `root`：子包根目录，即 `pages/{目录名}`
- `name`：子包名称，取目录名
- `path`：子包内页面路径为相对于 `root` 的路径（即只保留文件名部分）
- 同一目录下的多个页面归入同一个子包
- tabBar 页面**不能**放入子包，必须留在主包
- 首页（pages 数组第一项）**不能**放入子包
