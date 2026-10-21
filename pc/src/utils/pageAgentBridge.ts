import { ElMessageBox } from "element-plus";

/**
 * 浏览器侧的页面操作通道。
 *
 * 和宿主保持一条 SSE：宿主推 task 帧，这里用 PageAgent 操作当前 SPA，
 * 执行完把结果 POST 回去。PageAgent 的模型请求走 /agent/llm 代理，
 * 浏览器不持有 DEEPSEEK_API_KEY。
 */

const TOKEN_KEY = "store.usr.authorization";
const STREAM_URL = "/agent/api/page-agent/stream";
const STATUS_URL = "/agent/api/page-agent/status";
const LLM_BASE = () => `${location.origin}/agent/llm/v1`;

/** always：每个任务都确认；risky：命中危险词才确认；never：不确认（默认） */
const CONFIRM_POLICY = (import.meta.env.VITE_AGENT_PAGE_CONFIRM || "never") as
  | "always"
  | "risky"
  | "never";

const RISKY_PATTERN =
  /删除|移除|提交|保存|发布|下单|支付|退款|审批|通过|驳回|重置|修改|更新|授权|解绑|停用|启用|注销|清空/;

const PAGE_MODEL = import.meta.env.VITE_AGENT_PAGE_MODEL || "deepseek-v4-flash";

const SYSTEM_PROMPT = [
  "你是嵌入在本系统中的页面操作助手，只能操作当前站点内的页面元素。",
  "- 用页面上可见的中文文案定位元素，优先点按钮、菜单、表格行内操作。",
  "- 不要打开站外域名、不要新开窗口、不要注入脚本。",
  "- 只有缺少关键信息（比如不知道选哪一行）时才调用 ask_user，不要为了确认安全而询问。",
  "- 完成后用一句中文说明做了什么，以及页面当前状态。",
].join("\n");

type CollapseHandler = () => Promise<void> | void;

/** 由 AgentChatDrawer 注册：任务开始前把抽屉收起来，避免挡住要操作的页面 */
let collapseHandler: CollapseHandler | null = null;

export function registerAssistantCollapse(handler: CollapseHandler | null): void {
  collapseHandler = handler;
}

async function collapseAssistant(): Promise<void> {
  if (!collapseHandler) return;
  try {
    await collapseHandler();
  } catch {
    // 收起失败不影响任务
  }
}

type PageAgentInstance = import("@page-agent/core").PageAgentCore;

interface TaskPayload {
  id: string;
  instruction: string;
  maxSteps?: number;
}

let started = false;
let connecting = false;
let abort: AbortController | null = null;
let retryTimer: number | undefined;
let retryDelay = 3_000;
let heartbeatTimer: number | undefined;
let agentPromise: Promise<PageAgentInstance> | null = null;
let taskRunning = false;
/** 宿主在 ready 帧里下发，用于让心跳精确落到当前标签页 */
let channelId = "";

function token(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function currentPath(): string {
  const hash = location.hash.replace(/^#/, "");
  return hash || location.pathname;
}

function maskSensitive(content: string): string {
  return content
    .replace(/\beyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]{8,}\b/g, "[token]")
    .replace(/\b1[3-9]\d{9}\b/g, "[phone]")
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[email]")
    .replace(/\b\d{17}[\dXx]\b/g, "[id]")
    .replace(/\b\d{16,19}\b/g, "[card]");
}

/** 模型代理：补上当前登录态，key 由宿主注入 */
const proxyFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  const current = token();
  if (current) headers.set("authorization", `Bearer ${current}`);
  return fetch(input, { ...init, headers, cache: "no-store" });
};

async function ensureAgent(): Promise<PageAgentInstance> {
  if (!agentPromise) {
    agentPromise = (async () => {
      const [{ PageAgentCore }, { PageController }] = await Promise.all([
        import("@page-agent/core"),
        import("@page-agent/page-controller"),
      ]);

      const agent = new PageAgentCore({
        pageController: new PageController({ enableMask: false }),
        baseURL: LLM_BASE(),
        model: PAGE_MODEL,
        apiKey: "proxy",
        customFetch: proxyFetch,
        language: "zh-CN",
        maxSteps: 40,
        stepDelay: 0.2,
        disableNamedToolChoice: true,
        transformPageContent: maskSensitive,
        instructions: { system: SYSTEM_PROMPT },
      });

      // onAskUser 是实例属性而不是构造参数
      agent.onAskUser = async (question) => {
        try {
          const { value } = await ElMessageBox.prompt(question, "智能助手需要确认", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            inputPlaceholder: "请输入后提交",
          });
          return value ?? "";
        } catch {
          return "";
        }
      };

      return agent;
    })().catch((error) => {
      agentPromise = null;
      throw error;
    });
  }
  return agentPromise;
}

async function confirmTask(instruction: string): Promise<boolean> {
  if (CONFIRM_POLICY === "never") return true;
  if (CONFIRM_POLICY === "risky" && !RISKY_PATTERN.test(instruction)) return true;

  try {
    await ElMessageBox.confirm(instruction, "智能助手请求操作当前页面", {
      confirmButtonText: "允许执行",
      cancelButtonText: "拒绝",
      type: "warning",
      distinguishCancelAndClose: true,
    });
    return true;
  } catch {
    return false;
  }
}

async function postResult(id: string, body: Record<string, unknown>): Promise<void> {
  const current = token();
  if (!current) return;
  try {
    await fetch(`/agent/api/page-agent/tasks/${encodeURIComponent(id)}/result`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${current}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    // 宿主已断开时忽略；任务会由服务端超时回收
  }
}

async function handleTask(payload: TaskPayload): Promise<void> {
  if (taskRunning) {
    await postResult(payload.id, { success: false, data: "页面正在执行上一个操作" });
    return;
  }

  const allowed = await confirmTask(payload.instruction);
  if (!allowed) {
    await postResult(payload.id, { success: false, data: "用户拒绝了本次页面操作" });
    return;
  }

  taskRunning = true;
  try {
    // 抽屉/浮层会挡住页面元素，先收起来再让 PageAgent 扫描 DOM
    await collapseAssistant();

    const agent = await ensureAgent();
    // 每次任务按服务端下发的上限跑，40 是硬上限
    const runtime = agent.config as unknown as { maxSteps: number };
    runtime.maxSteps = Math.min(Math.max(payload.maxSteps ?? 20, 1), 40);

    const result = await agent.execute(payload.instruction);
    await postResult(payload.id, {
      success: result.success,
      data: result.data,
      steps: result.history?.length ?? 0,
      path: currentPath(),
    });
  } catch (error) {
    await postResult(payload.id, {
      success: false,
      data: `页面操作失败：${error instanceof Error ? error.message : String(error)}`,
      path: currentPath(),
    });
  } finally {
    taskRunning = false;
  }
}

async function handleFrame(event: string, data: string): Promise<void> {
  if (event === "ping") return;

  if (event === "ready") {
    try {
      const info = JSON.parse(data) as { channelId?: string };
      if (info.channelId) channelId = info.channelId;
    } catch {
      // ignore
    }
    void sendHeartbeat();
    return;
  }

  if (event === "cancel") {
    const agent = await agentPromise?.catch(() => null);
    await agent?.stop().catch(() => undefined);
    return;
  }

  if (event === "task") {
    let payload: TaskPayload | null = null;
    try {
      payload = JSON.parse(data) as TaskPayload;
    } catch {
      return;
    }
    if (!payload?.id || !payload.instruction) return;
    void handleTask(payload);
  }
}

function scheduleRetry(delay: number): void {
  if (!started || retryTimer) return;
  retryTimer = window.setTimeout(() => {
    retryTimer = undefined;
    void connect();
  }, delay);
}

async function connect(): Promise<void> {
  if (!started || connecting) return;
  connecting = true;

  const current = token();
  if (!current) {
    connecting = false;
    scheduleRetry(5_000);
    return;
  }

  const controller = new AbortController();
  abort = controller;
  channelId = "";

  try {
    const response = await fetch(STREAM_URL, {
      headers: {
        authorization: `Bearer ${current}`,
        accept: "text/event-stream",
      },
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      connecting = false;
      scheduleRetry(response.status === 401 ? 20_000 : 8_000);
      return;
    }

    // 连上后重置退避
    retryDelay = 3_000;
    startHeartbeat();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary >= 0) {
        const raw = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf("\n\n");

        let event = "message";
        const dataLines: string[] = [];
        for (const line of raw.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
        }
        if (dataLines.length > 0) {
          void handleFrame(event, dataLines.join("\n"));
        }
      }
    }
  } catch {
    // 断线、切网、后端重启都走重连
  } finally {
    connecting = false;
    stopHeartbeat();
    if (abort === controller) abort = null;

    if (started) {
      const delay = retryDelay;
      retryDelay = Math.min(retryDelay * 2, 30_000);
      scheduleRetry(delay);
    }
  }
}

function startHeartbeat(): void {
  stopHeartbeat();
  void sendHeartbeat();
  heartbeatTimer = window.setInterval(() => void sendHeartbeat(), 25_000);
}

async function sendHeartbeat(): Promise<void> {
  const current = token();
  if (!current) return;
  try {
    await fetch("/agent/api/page-agent/heartbeat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${current}`,
      },
      body: JSON.stringify({
        channelId,
        path: currentPath(),
        // 多标签页时，宿主优先把任务发给有焦点、可见的那个
        visible: document.visibilityState === "visible",
        focused: document.hasFocus(),
      }),
    });
  } catch {
    // 心跳失败不重试，下一次 tick 会自然补上
  }
}

function stopHeartbeat(): void {
  if (heartbeatTimer) {
    window.clearInterval(heartbeatTimer);
    heartbeatTimer = undefined;
  }
}

/** 在应用启动后调用一次；重复调用无副作用 */
export function startPageAgentBridge(): void {
  if (started) return;
  started = true;
  void connect();
}

/** 供聊天界面展示「页面是否可操作」 */
export async function fetchPageAgentStatus(): Promise<{ online: boolean; path: string } | null> {
  const current = token();
  if (!current) return null;
  try {
    const response = await fetch(STATUS_URL, {
      headers: { authorization: `Bearer ${current}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as { online: boolean; path: string };
  } catch {
    return null;
  }
}
