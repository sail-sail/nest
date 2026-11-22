---
name: websocket
description: 前端订阅后端 WebSocket 事件通知时使用
compatibility: Vue 3 / uni-app + Deno
metadata:
  version: "1.1"
---

# WebSocket 使用规范

## 路径

- PC：`pc/src/compositions/websocket.ts`
- Uni：`uni/src/compositions/websocket.ts`
- 后端：`deno/lib/websocket/websocket.dao.ts`

## 前端订阅

```ts
import {
  onBeforeUnmount,
  onMounted,
} from "vue";
import {
  subscribe,
  unSubscribe,
} from "@/compositions/websocket.ts";

type NewBookingOrder = {
  booking_order_id: string;
};

const topic = "newBookingOrder";

function handleNewBookingOrder(data: NewBookingOrder | undefined) {
  if (!data) {
    return;
  }
  // 更新 UI
}

onMounted(async () => {
  await subscribe<NewBookingOrder>(topic, handleNewBookingOrder);
});

onBeforeUnmount(async () => {
  await unSubscribe(topic, handleNewBookingOrder);
});
```

## 后端发布

```ts
import { publish } from "/lib/websocket/websocket.dao.ts";

await publish({
  topic: "newBookingOrder",
  payload: {
    booking_order_id: id.toString(),
  },
});
```

## 关键约束

- 前后端 `topic` 必须完全一致。
- 回调只接收 `payload`；取消单个订阅时必须传入同一函数引用。
- 组件卸载前取消订阅；不传回调会移除该 `topic` 的全部监听。
- WebSocket 只推送给当前在线连接，不提供离线持久化或补偿。
