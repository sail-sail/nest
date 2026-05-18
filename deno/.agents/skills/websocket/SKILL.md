---
name: websocket
description: WebSocket 使用规范. 需要在前端订阅后端事件通知时使用
compatibility: Vue 3 + Deno 后端
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
  ├── subscribe(topic, callback)   - 订阅主题
  └── unSubscribe(topic, callback) - 取消订阅

deno 后端: lib/websocket
  └── websocket_dao.publish(topic, payload) - 推送消息到前端
```

## 使用示例

### 前端订阅 (Vue/TS)

```typescript
import {
  subscribe,
  unSubscribe,
} from "@/compositions/websocket.ts";

try {
  await subscribe("newBookingOrder", (data) => {
    // data: 后端推送的 payload
    // 处理通知/更新 UI 等
  });
} catch (err) {
  // 订阅失败时记录错误，并根据业务决定是否提示用户或重试
  console.error("subscribe newBookingOrder failed", err);
}

try {
  await unSubscribe("newBookingOrder", callback);
} catch (err) {
  // 取消订阅失败时同样要记录，避免重复订阅或页面卸载后残留监听
  console.error("unSubscribe newBookingOrder failed", err);
}
```

### 后端发布 (Deno)

```typescript
import { publish } from "/lib/websocket/websocket.dao.ts";

await publish(
  "newBookingOrder",
  {
    booking_order_id: id.toString(),
  }
);
```
