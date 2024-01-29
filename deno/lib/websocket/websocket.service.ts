import {
  wsClient,
} from "./websocket.dao.ts";

wsClient.subscribe("edit", (dataStr: string) => {
  const data = JSON.parse(dataStr);
  const payload = data.payload;
  wsClient.publish({
    topic: payload,
    payload: "edit",
  });
});
