---
name: websocket
description: WebSocket 使用规范. 需要在前端订阅后端事件通知时使用
compatibility: Vue 3 + Rust 后端
metadata:
  version: "1.0"
---

# WebSocket 使用规范

## 架构

```
uni/src/compositions/websocket.ts  (移动端客户端)
  ├── subscribe(topic, callback)   - 订阅主题
  └── unSubscribe(topic, callback) - 取消订阅

src/compositions/websocket.ts (PC端客户端)
  └── (同上)

rust 后端: generated/common/websocket
  ├── websocket_dao::publish(topic, payload)    - 推送消息到前端
  ├── websocket_dao::subscribe_client_topics()  - 订阅主题
  └── websocket_dao::un_subscribe_client_topics() - 取消订阅
```

## 使用示例

### 前端订阅 (Vue/TS)

```typescript
import { subscribe } from "@/compositions/websocket.ts";

await subscribe("newBookingOrder", (data) => {
  // data: 后端推送的 payload
  // 处理通知/更新 UI 等
});
```

### 后端发布 (Rust)

```rust
generated::common::websocket::websocket_dao::publish(
  "newBookingOrder".to_string(),
  Some(serde_json::json!({
    "booking_order_id": id.to_string(),
  })),
).await;
```

## 后端路由

- 升级路径: `/api/websocket/upgrade`
- 连接参数: `?clientId=xxx&pwd=xxx`
- 客户端支持 `subscribe`、`unSubscribe`、`ping` 三种操作

## 注意事项

- `publish()` 返回 `()`, 不返回 `Result`, 无需处理推送失败
- 如果目标客户端未连接, `publish` 内部会静默跳过, 不会报错
- 一个 clientId 可以连接多个 socket, 通过 connection_id 区分
- 主题名是大小写敏感的字符串, 建议用驼峰命名
