import {
  shortUuidV4,
} from "/lib/util/string_util.ts";

export const wsClient = {
  
  clientId: shortUuidV4<string>(),
  
  /** 订阅主题topic */
  subscribe(
    topic: string,
    callback: ((data: string) => void),
  ) { },
  
  /** 发布消息 */
  publish(
    data: {
      topic: string;
      payload: any;
    },
  ) { },
  
  /** 取消订阅主题topic */
  unSubscribe(
    topic: string,
    callback: Function,
  ) { },
  
  /** 关闭客户端 */
  closeClient() { },
  
};
