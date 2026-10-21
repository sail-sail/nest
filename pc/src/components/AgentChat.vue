<template>
<div class="agent-chat">
  <header class="agent-chat__head">
    <div class="agent-chat__title">
      <span class="agent-chat__logo">AI</span>
      <div>
        <div class="agent-chat__name">智能助手</div>
        <div class="agent-chat__status">
          <span
            class="agent-chat__dot"
            :class="{ 'is-run': running }"
          ></span>
          {{ statusText }}
        </div>
      </div>
    </div>

    <div class="agent-chat__actions">
      <span
        class="agent-chat__page"
        :class="{ 'is-on': pageOnline }"
        :title="pageOnline ? '可在当前浏览器页面上执行点击、填写等操作' : '页面操作通道未连接'"
      >
        {{ pageOnline ? "页面可操作" : "页面未连接" }}
      </span>
      <CustomSelect
        v-model="activeId"
        class="agent-chat__select"
        size="small"
        placeholder="选择会话"
        :method="chatSelectMethod"
        :options-map="((item: ConversationItem) => ({
          label: item.title,
          value: item.id,
        }))"
        :disabled="running"
        @change="onSelectConversation"
      ></CustomSelect>
      <el-button
        size="small"
        :disabled="running"
        @click="createConversation"
      >
        新会话
      </el-button>
    </div>
  </header>

  <div
    ref="scrollEl"
    class="agent-chat__body"
    @scroll="onScroll"
  >
    <div
      v-if="items.length === 0"
      class="agent-chat__empty"
    >
      <div class="agent-chat__empty-title">
        可以帮你查数据、看报表、找字段
      </div>
      <div class="agent-chat__chips">
        <button
          v-for="hint in hints"
          :key="hint"
          class="agent-chat__chip"
          @click="input = hint"
        >
          {{ hint }}
        </button>
      </div>
    </div>

    <template
      v-for="item in items"
      :key="item.id"
    >
      <div
        v-if="item.kind === 'user'"
        class="msg msg--user"
      >
        <div class="msg__bubble">
          {{ item.text }}
        </div>
      </div>

      <div
        v-else-if="item.kind === 'assistant'"
        class="msg msg--assistant"
      >
        <span class="msg__avatar">AI</span>
        <div class="msg__main">
          <details
            v-if="item.reasoning"
            class="msg__reasoning"
          >
            <summary>思考过程</summary>
            <pre>{{ item.reasoning }}</pre>
          </details>
          <MarkdownRender
            v-if="item.text"
            class="msg__markdown"
            mode="chat"
            custom-id="agent"
            :custom-html-tags="['echarts', 'chart']"
            :mermaid-props="{
              isStrict: true,
              enableMermaidInteractions: false,
              fitPreviewHeight: true,
              maxHeight: '520px',
            }"
            :content="item.text"
            :final="item.final"
            :typewriter="!item.final"
            :is-dark="isDark"
            :fade="false"
          />
        </div>
      </div>

      <div
        v-else
        class="tool"
        :class="{ 'tool--error': item.isError }"
      >
        <button
          class="tool__head"
          @click="item.open = !item.open"
        >
          <span
            class="tool__state"
            :class="{
              'is-done': item.done && !item.isError,
              'is-error': item.isError,
            }"
          ></span>
          <span class="tool__name">{{ item.name }}</span>
          <span class="tool__hint">
            {{ item.done ? (item.isError ? "失败" : "完成") : "执行中…" }}
          </span>
          <span class="tool__chev">{{ item.open ? "▴" : "▾" }}</span>
        </button>
        <div
          v-if="item.open"
          class="tool__body"
        >
          <div class="tool__label">参数</div>
          <pre class="tool__pre">{{ pretty(item.args) }}</pre>
          <template v-if="item.done">
            <div class="tool__label">结果</div>
            <pre class="tool__pre">{{ item.content }}</pre>
          </template>
        </div>
      </div>
    </template>

    <div
      v-if="running && !items.some((item) => item.kind === 'tool' && !item.done)"
      class="msg msg--assistant"
    >
      <span class="msg__avatar">AI</span>
      <div class="msg__typing">
        <i></i><i></i><i></i>
      </div>
    </div>
  </div>

  <footer class="agent-chat__foot">
    <el-input
      ref="inputRef"
      v-model="input"
      type="textarea"
      :rows="3"
      resize="none"
      placeholder="问点什么"
      :disabled="running"
      @keydown.enter="onEnter"
    />
    <div class="agent-chat__send">
      <span class="agent-chat__tip">Enter 发送，Shift + Enter 换行</span>
      <el-button
        v-if="running"
        size="small"
        @click="stop"
      >
        断开
      </el-button>
      <el-button
        v-else
        type="primary"
        size="small"
        :disabled="!input.trim()"
        @click="send"
      >
        发送
      </el-button>
    </div>
  </footer>
</div>
</template>

<script setup lang="ts">
import MarkdownRender, { setCustomComponents } from "markstream-vue";
import "markstream-vue/index.css";
import AgentEChartsBlock from "./AgentEChartsBlock.vue";
import AgentEChartsTag from "./AgentEChartsTag.vue";
import { fetchPageAgentStatus } from "@/utils/pageAgentBridge";

setCustomComponents("agent", {
  code_block: AgentEChartsBlock,
  echarts: AgentEChartsTag,
  chart: AgentEChartsTag,
});

interface ConversationItem {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface UserItem {
  kind: "user";
  id: string;
  time: number;
  text: string;
}

interface AssistantItem {
  kind: "assistant";
  id: string;
  time: number;
  text: string;
  reasoning?: string;
  final: boolean;
}

interface ToolItem {
  kind: "tool";
  id: string;
  time: number;
  callId: string;
  name: string;
  args: unknown;
  content?: string;
  isError: boolean;
  done: boolean;
  open: boolean;
}

type ChatItem = UserItem | AssistantItem | ToolItem;

const usrStore = useUsrStore();
const isDark = useDark();

const conversations = ref<ConversationItem[]>([]);
const activeId = useStorage<string>("store.agent.conversationId", "");
const items = ref<ChatItem[]>([]);
const input = ref("");
const running = ref(false);
const inited = ref(false);
const statusText = ref("就绪");
const scrollEl = ref<HTMLElement>();
const inputRef = ref<HTMLInputElement>();
const stick = ref(true);
const abortController = shallowRef<AbortController>();

function chatSelectMethod() {
  return conversations;
}

const hints = [
];

function authHeaders(): Record<string, string> {
  return {
    "content-type": "application/json",
    authorization: `Bearer ${usrStore.authorization}`,
  };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/agent/api${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `请求失败（${response.status}）`);
  }
  return (await response.json()) as T;
}

function pretty(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2) ?? "";
  } catch {
    return String(value);
  }
}

function scrollToBottom() {
  nextTick(() => {
    const el = scrollEl.value;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      // 初始化完成前不做平滑滚动
      behavior: inited.value ? "smooth" : "auto",
    });
  });
}

/** 初始化/切换会话：下一帧瞬时到底，再把平滑滚动打开 */
async function jumpToBottomNow() {
  stick.value = true;
  inited.value = false;
  await nextTick();
  const el = scrollEl.value;
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  inited.value = true;
}

/** 抽屉重新打开 / KeepAlive 激活：已经初始化过才需要重新定位 */
function onOpen() {
  if (!inited.value) return;
  void jumpToBottomNow();
}

function onScroll() {
  const el = scrollEl.value;
  if (!el) return;
  stick.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
}

watch(
  [items, running],
  () => {
    // 初始化完成前由 jumpToBottomNow() 负责定位，避免平滑滚到底
    if (!inited.value) return;
    if (stick.value) scrollToBottom();
  },
  { deep: true },
);

function toItems(messages: Array<Record<string, unknown>>): ChatItem[] {
  const result: ChatItem[] = [];
  for (const message of messages) {
    const role = message.role;
    const id = String(message.id ?? "");
    const time = Number(message.time ?? Date.now());
    if (role === "user") {
      result.push({ kind: "user", id, time, text: String(message.text ?? "") });
    } else if (role === "assistant") {
      const text = String(message.text ?? "");
      const reasoning = String(message.reasoning ?? "");
      if (!text && !reasoning) continue;
      result.push({ kind: "assistant", id, time, text, reasoning, final: true });
    } else if (role === "tool_call") {
      result.push({
        kind: "tool",
        id,
        time,
        callId: String(message.callId ?? ""),
        name: String(message.name ?? "tool"),
        args: message.args,
        isError: false,
        done: false,
        open: false,
      });
    } else if (role === "tool_result") {
      const callId = String(message.callId ?? "");
      const target = result.find((item) => item.kind === "tool" && item.callId === callId);
      if (target && target.kind === "tool") {
        target.content = String(message.content ?? "");
        target.isError = message.isError === true;
        target.done = true;
      }
    }
  }
  return result;
}

async function loadMessages(conversationId: string) {
  const data = await api<{ messages: Array<Record<string, unknown>> }>(
    `/conversations/${conversationId}/messages`,
  );
  inited.value = false;
  items.value = toItems(data.messages);
  await jumpToBottomNow();
}

async function selectConversation(conversationId: string) {
  activeId.value = conversationId;
  await loadMessages(conversationId);
}

async function refreshConversations() {
  const data = await api<{ conversations: ConversationItem[] }>("/conversations");
  conversations.value = data.conversations;
}

async function createConversation() {
  if (running.value) return;
  const data = await api<{ conversation: ConversationItem }>("/conversations", {
    method: "POST",
    body: JSON.stringify({}),
  });
  conversations.value.unshift(data.conversation);
  activeId.value = data.conversation.id;
  items.value = [];
  input.value = "";
}

async function onSelectConversation(value: unknown) {
  const item = Array.isArray(value) ? value[0] : value;
  const conversationId = typeof item === "string"
    ? item
    : item && typeof item === "object" && "id" in item && typeof (item as { id?: unknown }).id === "string"
      ? (item as { id: string }).id
      : "";

  if (!conversationId) return;
  await loadMessages(conversationId);
  inputRef.value?.focus();
}

function onEnter(event: Event | KeyboardEvent) {
  if (!(event instanceof KeyboardEvent)) return;
  if (event.isComposing) return;
  if (event.shiftKey) return;
  event.preventDefault();
  void send();
}

function handleFrame(event: string, data: Record<string, unknown>) {
  if (event === "assistant") {
    const text = typeof data.text === "string" ? data.text : "";
    const reasoning = typeof data.reasoning === "string" ? data.reasoning : "";
    if (!text && !reasoning) return;
    items.value.push({
      kind: "assistant",
      id: `a-${String(data.seq ?? Date.now())}`,
      time: Date.now(),
      text,
      reasoning,
      final: false,
    });
    return;
  }

  if (event === "tool_call") {
    items.value.push({
      kind: "tool",
      id: `t-${String(data.seq ?? Date.now())}`,
      time: Date.now(),
      callId: typeof data.callId === "string" ? data.callId : "",
      name: typeof data.name === "string" ? data.name : "tool",
      args: data.arguments,
      isError: false,
      done: false,
      open: true,
    });
    statusText.value = "正在调用工具…";
    return;
  }

  if (event === "tool_result") {
    const callId = typeof data.callId === "string" ? data.callId : "";
    const target = items.value.find((item) => item.kind === "tool" && item.callId === callId);
    if (target && target.kind === "tool") {
      target.content = typeof data.content === "string" ? data.content : "";
      target.isError = data.isError === true;
      target.done = true;
      target.open = false;
    }
    statusText.value = "正在整理结果…";
    return;
  }

  if (event === "status") {
    if (data.status === "running") statusText.value = "正在思考…";
    return;
  }

  if (event === "done") {
    for (const item of items.value) {
      if (item.kind === "assistant") item.final = true;
    }
    const finalResponse = typeof data.finalResponse === "string" ? data.finalResponse : "";
    if (finalResponse) statusText.value = "就绪";
    return;
  }

  if (event === "error") {
    const message = typeof data.message === "string" ? data.message : "智能体执行失败";
    ElMessage.error(message);
    statusText.value = "出错了";
  }
}

async function readSse(response: Response, onFrame: (event: string, data: Record<string, unknown>) => void) {
  if (!response.body) throw new Error("浏览器不支持流式响应");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
    let index = buffer.indexOf("\n\n");
    while (index !== -1) {
      const raw = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      let event = "message";
      let payload = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) payload += line.slice(5).trim();
      }
      if (payload) {
        try {
          onFrame(event, JSON.parse(payload) as Record<string, unknown>);
        } catch {
          // ignore malformed frame
        }
      }
      index = buffer.indexOf("\n\n");
    }
  }
}

async function send() {
  const text = input.value.trim();
  if (!text || running.value) return;
  if (!activeId.value) await createConversation();
  const conversationId = activeId.value;
  if (!conversationId) return;

  input.value = "";
  stick.value = true;
  items.value.push({
    kind: "user",
    id: `u-${Date.now()}`,
    time: Date.now(),
    text,
  });
  running.value = true;
  statusText.value = "正在思考…";
  const controller = new AbortController();
  abortController.value = controller;

  try {
    const response = await fetch(`/agent/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(message || `请求失败（${response.status}）`);
    }
    await readSse(response, handleFrame);
  } catch (error) {
    if ((error as Error).name !== "AbortError") {
      ElMessage.error((error as Error).message || "智能体执行失败");
    }
  } finally {
    running.value = false;
    abortController.value = undefined;
    statusText.value = "就绪";
    for (const item of items.value) {
      if (item.kind === "assistant") item.final = true;
    }
    await refreshConversations().catch(() => {});
  }
}

function stop() {
  abortController.value?.abort();
  running.value = false;
  statusText.value = "已停止";
}

async function init() {
  if (!usrStore.authorization) return;
  try {
    await refreshConversations();
    if (activeId.value && conversations.value.some((item) => item.id === activeId.value)) {
      await loadMessages(activeId.value);
    } else if (conversations.value[0]) {
      await selectConversation(conversations.value[0].id);
    } else {
      await createConversation();
    }
  } catch (error) {
    ElMessage.error((error as Error).message || "智能体初始化失败");
  }
}

const pageOnline = ref(false);
let pageStatusTimer: number | undefined;

async function refreshPageStatus() {
  const status = await fetchPageAgentStatus();
  pageOnline.value = status?.online === true;
}

defineExpose({ onOpen });

onActivated(onOpen);

onMounted(init);

onMounted(() => {
  void refreshPageStatus();
  pageStatusTimer = window.setInterval(() => void refreshPageStatus(), 20_000);
});

onUnmounted(() => {
  if (pageStatusTimer) window.clearInterval(pageStatusTimer);
});
</script>

<style lang="scss" scoped>
.agent-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.agent-chat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.agent-chat__title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.agent-chat__logo,
.msg__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: linear-gradient(135deg, #4f7cff, #7a5cff);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex: none;
}

.agent-chat__name {
  font-size: 14px;
  font-weight: 600;
}

.agent-chat__status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.agent-chat__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-success);
}

.agent-chat__dot.is-run {
  background: var(--el-color-primary);
  animation: agent-pulse 1.2s ease-in-out infinite;
}

.agent-chat__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-chat__page {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  white-space: nowrap;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}

.agent-chat__page.is-on {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.agent-chat__select {
  width: 280px;
}

.agent-chat__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 16px 8px;
}

.agent-chat__empty {
  padding: 28px 8px;
}

.agent-chat__empty-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 14px;
}

.agent-chat__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.agent-chat__chip {
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-lighter);
  color: var(--el-text-color-regular);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.agent-chat__chip:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.msg {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.msg--user {
  justify-content: flex-end;
}

.msg__bubble {
  max-width: 86%;
  padding: 10px 14px;
  border-radius: 14px 14px 4px 14px;
  background: var(--el-color-primary);
  color: #fff;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg--assistant {
  align-items: flex-start;
}

.msg__main {
  min-width: 0;
  max-width: calc(100% - 40px);
  flex: 1;
}

.msg__markdown {
  font-size: 13px;
  line-height: 1.75;
}

.msg__reasoning {
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  border-left: 2px solid var(--el-border-color);
  padding-left: 10px;
}

.msg__reasoning summary {
  cursor: pointer;
  user-select: none;
}

.msg__reasoning pre {
  margin: 6px 0 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.msg__typing {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
}

.msg__typing i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--el-color-primary);
  animation: agent-bounce 1s ease-in-out infinite;
}

.msg__typing i:nth-child(2) {
  animation-delay: 0.15s;
}

.msg__typing i:nth-child(3) {
  animation-delay: 0.3s;
}

.tool {
  margin: 0 0 14px 40px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  overflow: hidden;
  background: var(--el-fill-color-lighter);
}

.tool--error {
  border-color: var(--el-color-danger-light-5);
}

.tool__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  background: transparent;
  color: var(--el-text-color-primary);
  cursor: pointer;
  text-align: left;
}

.tool__state {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--el-color-primary);
  animation: agent-pulse 1.2s ease-in-out infinite;
  flex: none;
}

.tool__state.is-done {
  background: var(--el-color-success);
  animation: none;
}

.tool__state.is-error {
  background: var(--el-color-danger);
  animation: none;
}

.tool__name {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--el-font-family-mono, monospace);
}

.tool__hint {
  margin-left: auto;
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.tool__chev {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.tool__body {
  padding: 0 10px 10px;
}

.tool__label {
  margin: 6px 0 4px;
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.tool__pre {
  margin: 0;
  max-height: 220px;
  overflow: auto;
  padding: 8px;
  border-radius: 6px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 11px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.agent-chat__foot {
  padding: 10px 16px 14px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.agent-chat__send {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.agent-chat__tip {
  margin-right: auto;
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}

@keyframes agent-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.85); }
}

@keyframes agent-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-3px); opacity: 1; }
}
</style>
