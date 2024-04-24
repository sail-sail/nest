export type Message = {
  hide: boolean;
  type: "info" | "error";
  content: string;
  /** 暂停计时 */
  isPause: boolean;
  /** 倒计时 */
  duration: number;
  timer?: NodeJS.Timeout;
};

export const useMsgs = () => {
  
  const msgs = useState<Message[]>("msg/msgs", () => [ ]);
  
  const showMsg = (msg: {
    type?: "info" | "error";
    content: string;
  }) => {
    if (!msg.content) {
      return;
    }
    const idx = msgs.value.push({
      hide: false,
      type: msg.type || "info",
      content: msg.content,
      isPause: false,
      duration: 3000,
      timer: undefined,
    });
    const i = idx - 1;
    msgs.value[i].timer = setTimeout(() => {
      msgs.value[i].hide = true;
      if (msgs.value.filter((item) => item.hide === false).length === 0) {
        msgs.value = [ ];
      }
    }, msgs.value[i].duration || 300);
  };
  return {
    msgs,
    showMsg,
  };
};
