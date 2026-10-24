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
      <div>
        <el-icon
          class="agent-chat__delete"
          un-cursor-pointer
          un-text="hover:red"
          :title="activeId ? '删除当前会话' : '暂无可删除会话'"
          :class="{ 'is-disabled': !activeId || running }"
          @click="deleteCurrentConversation"
        >
          <ElIconCircleClose />
        </el-icon>
      </div>
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
          <div v-if="item.display">{{ item.display }}</div>
          <div
            v-if="item.files.length"
            class="msg__files"
          >
            <span
              v-for="file in item.files"
              :key="file.id"
              class="msg__file"
            >{{ file.name }}</span>
          </div>
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
    <div
      v-if="attachments.length"
      class="agent-chat__files"
    >
      <span
        v-for="file in attachments"
        :key="file.key"
        class="file-chip"
        :class="{ 'is-loading': file.uploading, 'is-error': !!file.error }"
        :title="file.error || file.filename"
      >
        <span class="file-chip__name">{{ file.filename }}</span>
        <span class="file-chip__size">
          {{ file.uploading ? "上传中…" : formatSize(file.size) }}
        </span>
        <button
          class="file-chip__remove"
          type="button"
          :disabled="running"
          @click="removeAttachment(file)"
        >×</button>
      </span>
    </div>
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
    <input
      ref="fileInputRef"
      class="agent-chat__file-input"
      type="file"
      multiple
      @change="onPickFiles"
    />
    <div class="agent-chat__send">
      <el-button
        size="small"
        text
        :disabled="running || uploading"
        @click="pickFile"
      >
        <template #icon>
          <ElIconUpload />
        </template>
        <span>
          上传附件
        </span>
      </el-button>
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
        :disabled="!canSend"
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

interface MessageFile {
  id: string;
  name: string;
}

interface UserItem {
  kind: "user";
  id: string;
  time: number;
  /** 原始文本（含附件 hint），409 回滚时用 */
  text: string;
  /** 展示文本（已剥离附件 hint） */
  display: string;
  files: MessageFile[];
}

interface PendingAttachment {
  key: string;
  id: string;
  /** 服务端返回的引用片段：[附件 att_xxx 文件名] */
  hint: string;
  filename: string;
  size: number;
  uploading: boolean;
  error?: string;
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
const fileInputRef = ref<HTMLInputElement>();
const attachments = ref<PendingAttachment[]>([]);
const uploading = ref(false);
const stick = ref(true);
const abortController = shallowRef<AbortController>();

/** 与服务端 hint 格式保持一致：[附件 att_xxx 文件名] */
const ATTACHMENT_HINT = /\[附件 (att_[A-Za-z0-9]+) ([^\]\n]+)\]/g;
/** 客户端软上限，真正的限制在服务端（AGENT_ATTACHMENT_MAX_BYTES，默认 10MB） */
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
let attachmentSeq = 0;

const canSend = computed(
  () =>
    !running.value
    && !uploading.value
    && (!!input.value.trim() || attachments.value.some((file) => !!file.id && !file.error)),
);

function chatSelectMethod() {
  return conversations;
}

function authHeaders(): Record<string, string> {
  return {
    "content-type": "application/json",
    authorization: `Bearer ${usrStore.authorization}`,
  };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/agent/api${path}`, {
    ...init,
    headers: { ...authHeaders(), ...init?.headers },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `请求失败（${response.status}）`);
  }
  return (await response.json()) as T;
}

async function errorTextOf(response: Response): Promise<string> {
  const raw = await response.text().catch(() => "");
  try {
    const parsed = JSON.parse(raw) as { error?: string };
    return parsed.error || raw || `请求失败（${response.status}）`;
  } catch {
    return raw || `请求失败（${response.status}）`;
  }
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}

function pickFile() {
  if (running.value || uploading.value) return;
  fileInputRef.value?.click();
}

function removeAttachment(file: PendingAttachment) {
  attachments.value = attachments.value.filter((item) => item.key !== file.key);
}

/** 选中的文件直传宿主：字节不进模型，消息里只保留服务端给的 hint */
async function onPickFiles(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  // 清空后同一个文件才能再次触发 change
  target.value = "";
  if (!files.length) return;

  uploading.value = true;
  try {
    for (const file of files) {
      if (file.size > MAX_UPLOAD_BYTES) {
        ElMessage.warning(`${file.name} 超过 ${formatSize(MAX_UPLOAD_BYTES)}，未上传`);
        continue;
      }

      attachmentSeq += 1;
      const pending: PendingAttachment = {
        key: `file-${Date.now()}-${attachmentSeq}`,
        id: "",
        hint: "",
        filename: file.name,
        size: file.size,
        uploading: true,
      };
      attachments.value.push(pending);

      try {
        const response = await fetch(
          `/agent/api/attachments?name=${encodeURIComponent(file.name)}`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${usrStore.authorization}`,
              "content-type": file.type || "application/octet-stream",
            },
            body: file,
          },
        );
        if (!response.ok) throw new Error(await errorTextOf(response));
        const data = (await response.json()) as {
          attachment: { id: string; filename: string; size: number };
          hint: string;
        };
        pending.id = data.attachment.id;
        pending.hint = data.hint;
        pending.filename = data.attachment.filename;
        pending.size = data.attachment.size;
        pending.uploading = false;
      } catch (error) {
        pending.uploading = false;
        pending.error = (error as Error).message || "上传失败";
        ElMessage.error(`${file.name}：${pending.error}`);
      }
    }
  } finally {
    uploading.value = false;
  }
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
  [() => items.value.length, running],
  () => {
    // 初始化完成前由 jumpToBottomNow() 负责定位，避免平滑滚到底
    if (!inited.value) return;
    if (stick.value) scrollToBottom();
  },
);

/** 把消息里的 [附件 att_xxx 文件名] 拆出来：气泡展示正文 + 文件标签，不露原始标记 */
function parseUserText(raw: string): { display: string; files: MessageFile[] } {
  const files: MessageFile[] = [];
  const display = raw
    .replace(ATTACHMENT_HINT, (_match: string, id: string, name: string) => {
      files.push({ id, name });
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { display, files };
}

function toItems(messages: Array<Record<string, unknown>>): ChatItem[] {
  const result: ChatItem[] = [];
  for (const message of messages) {
    const role = message.role;
    const id = String(message.id ?? "");
    const time = Number(message.time ?? Date.now());
    if (role === "user") {
      const text = String(message.text ?? "");
      const { display, files } = parseUserText(text);
      result.push({ kind: "user", id, time, text, display, files });
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
  attachments.value = [];
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
  attachments.value = [];
}

async function deleteCurrentConversation() {
  const conversationId = activeId.value;
  if (!conversationId || running.value) return;

  try {
    await ElMessageBox.confirm(
      "确定删除这个会话吗？确定后会彻底删除该会话及其全部消息记录。",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
  } catch {
    return;
  }

  try {
    await api(`/conversations/${conversationId}`, { method: "DELETE" });
    conversations.value = conversations.value.filter((item) => item.id !== conversationId);
    const nextConversation = conversations.value[0];
    activeId.value = "";
    items.value = [];
    input.value = "";

    if (nextConversation) {
      await selectConversation(nextConversation.id);
    } else {
      await createConversation();
    }
    ElMessage.success("会话已删除");
  } catch (error) {
    ElMessage.error((error as Error).message || "删除会话失败");
  }
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
    // 更新已有条目不触发 length 变化，这里手动补一次滚动
    if (stick.value) scrollToBottom();
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
    statusText.value = "就绪";
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
  const ready = attachments.value.filter(
    (file) => !!file.id && !!file.hint && !file.uploading && !file.error,
  );
  if ((!text && ready.length === 0) || running.value || uploading.value) return;
  if (!activeId.value) await createConversation();
  const conversationId = activeId.value;
  if (!conversationId) return;

  // 附件 hint 由服务端生成，原样拼在用户消息前，模型据此引用 attachmentId
  const markers = ready.map((file) => file.hint).join("\n");
  const payload = markers ? (text ? `${markers}\n\n${text}` : markers) : text;
  const parsed = parseUserText(payload);

  input.value = "";
  attachments.value = [];
  stick.value = true;
  const userItemId = `u-${Date.now()}`;
  items.value.push({
    kind: "user",
    id: userItemId,
    time: Date.now(),
    text: payload,
    display: parsed.display,
    files: parsed.files,
  });
  running.value = true;
  statusText.value = "正在思考…";
  const controller = new AbortController();
  abortController.value = controller;

  try {
    const response = await fetch(`/agent/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ text: payload }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const raw = await response.text().catch(() => "");
      let message = raw;
      try {
        message = (JSON.parse(raw) as { error?: string }).error ?? raw;
      } catch {
        // 非 JSON 错误体原样展示
      }
      if (response.status === 409) {
        // 本轮未被服务端接受（上一轮仍在生成）：回滚乐观消息并恢复输入与附件
        items.value = items.value.filter((item) => item.id !== userItemId);
        input.value = text;
        attachments.value = ready;
      }
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
  if (process.env.NODE_ENV === "production") {
    pageStatusTimer = window.setInterval(() => void refreshPageStatus(), 20_000);
  }
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

.agent-chat__delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.agent-chat__delete:hover {
  color: var(--el-color-danger);
}

.agent-chat__delete.is-disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
  pointer-events: none;
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

.msg__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.msg__file {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgb(255 255 255 / 18%);
  font-size: 12px;
  line-height: 1.6;
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

.agent-chat__file-input {
  display: none;
}

.agent-chat__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 3px 6px 3px 8px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.file-chip.is-loading {
  opacity: 0.6;
}

.file-chip.is-error {
  border-color: var(--el-color-danger-light-5);
  color: var(--el-color-danger);
}

.file-chip__name {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-chip__size {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.file-chip__remove {
  padding: 0 2px;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}

.file-chip__remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
