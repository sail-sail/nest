---
name: websocket
description: WebSocket 使用规范. 当需要在前端订阅后端事件通知时使用此技能
compatibility: Vue 3 + Rust 后端
metadata:
  version: "1.0"
---

# WebSocket 使用规范

## 架构

```
uni/src/compositions/websocket.ts  (移动端客户端)
  ├── subscribe(topic, callback)   - 订阅主题
  ├── unSubscribe(topic, callback) - 取消订阅
  └── publish({ topic, payload })  - 发布消息

src/compositions/websocket.ts (PC端客户端)
  └── (同上)

rust 后端: generated/common/websocket
  └── websocket_dao::publish(topic, payload) - 推送消息到前端
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

## 注意事项

- 同主题可注册多个 callback
- 取消订阅时需传入相同的 callback 引用才能精确移除
