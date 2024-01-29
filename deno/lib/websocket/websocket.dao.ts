
export const wsClient = {
  
  /** 订阅主题topic */
  subscribe(
    _topic: string,
    _callback: ((data: string) => void),
  ) { },
  
  /** 发布消息 */
  publish(
    _data: {
      topic: string;
      // deno-lint-ignore no-explicit-any
      payload: any;
    },
  ) { },
  
  /** 取消订阅主题topic */
  unSubscribe(
    _topic: string,
    // deno-lint-ignore ban-types
    _callback: Function,
  ) { },
  
  /** 关闭客户端 */
  closeClient() { },
  
};
