---
name: websocket
description: 前端订阅或后端发布 WebSocket 事件时使用
compatibility: Vue 3 + Rust 后端
metadata:
  version: "1.1"
---

# WebSocket 使用规范

## 强制规则

1. 前端只能通过 `@/compositions/websocket.ts` 订阅，禁止新建连接、自行重连或手写心跳。
2. 订阅必须成对取消；`unSubscribe` 必须传入订阅时的同一个 `callback`，否则会移除该 `topic` 的全部回调。
3. `topic` 是大小写敏感的完整字符串，发布端和订阅端必须逐字符一致。
4. `payload` 可能为空；回调必须按 `T | undefined` 处理。
5. PC 组件优先使用 `useSubscribe`；Uni 或需要手动控制生命周期时使用 `subscribe` / `unSubscribe`。
6. 后端只调用 `websocket_dao::publish` 发布。它返回 `()`，无在线订阅者时静默跳过，不能作为业务成功依据。

## 前端订阅

```ts
import {
  subscribe,
  unSubscribe,
} from "@/compositions/websocket.ts";

const topic = `${usr_id}/message`;
const onMessage = (data: MessagePayload | undefined) => {
  if (!data) return;
  refresh();
};

onMounted(() => subscribe(topic, onMessage));
onBeforeUnmount(() => unSubscribe(topic, onMessage));
```

PC 组件可直接调用 `useSubscribe<MessagePayload>(topic, onMessage)`，由封装自动处理挂载和卸载。

## 后端发布

```rust
use generated::common::websocket::websocket_dao::publish;

publish(
  format!("{usr_id}/message"),
  Some(serde_json::json!({
    "messageId": message_id,
  })),
).await;
```

## 实现位置

- PC: `pc/src/compositions/websocket.ts`
- Uni: `uni/src/compositions/websocket.ts`
- 后端: `rust/generated/common/websocket/websocket_dao.rs`
