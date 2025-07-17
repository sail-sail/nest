export type Message = {
  id: number;
  type: "info" | "error";
  content: string;
  /** 倒计时 */
  duration: number;
  timer?: NodeJS.Timeout;
};

export const useMsgs = () => {
  
  const msgs = useState<Message[]>("msg/msgs", () => [ ]);
  
  const duration = 3000;
  
  const showMsg = (msg: {
    type?: "info" | "error";
    content: string;
  }) => {
    if (!msg.content) {
      return;
    }
    const id = Date.now();
    const msg2: Message = {
      id,
      type: msg.type || "info",
      content: msg.content,
      duration,
      timer: undefined,
    };
    msg2.timer = setTimeout(() => {
      msgs.value = msgs.value.filter((item) => item.id !== id);
    }, msg2.duration || 300);
    msgs.value.push(msg2);
  };
  
  const pauseMsg = (msg: Message) => {
    if (msg.timer) {
      clearTimeout(msg.timer);
      msg.timer = undefined;
    }
  }
  
  const resumeMsg = (msg: Message) => {
    if (!msg.timer) {
      msg.timer = setTimeout(() => {
        msgs.value = msgs.value.filter((item) => item.id !== msg.id);
      }, msg.duration || 300);
    }
  }
  
  return {
    msgs,
    showMsg,
    pauseMsg,
    resumeMsg,
  };
};
