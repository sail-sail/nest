# 电脑端界面

## 核心约束

1. 页面改动优先沿用 `src/views/{mod}/{table}/` 的既有结构扩展
2. 新增通用能力前先检查 `src/components/`，避免页面内重复实现
3. 不允许执行 `cargo fmt` 命令!