import { DeepSeekHarness, type HarnessNotification, type HarnessSession, type RunResult } from "@deepseek-ai/dsh-sdk-client";
import { config } from "./config.ts";
import type { BridgeHandle } from "./bridge.ts";
import { prepareLlmPatch, resolveModelRoute } from "./llm-config.ts";
import { errorMessage, log } from "./logger.ts";
import { prepareMcpPatch } from "./mcp-config.ts";
import { store, type ConversationRecord } from "./store.ts";

let harness: DeepSeekHarness | undefined;
let bridge: BridgeHandle | undefined;

/**
 * DEEPSEEK_BASE_URL 仅供宿主的 /agent/llm 代理使用。
 * dsh 子进程会读取同名变量并改变官方 provider 行为，导致会话返回空响应。
 * 这里显式剔除，避免宿主配置污染 dsh。
 */
function childEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  delete env.DEEPSEEK_BASE_URL;
  return env;
}

export function initHarness(bridgeHandle: BridgeHandle): void {
  bridge = bridgeHandle;
}

function getHarness(): DeepSeekHarness {
  if (!harness) {
    if (!bridge) throw new Error("bridge 尚未启动");
    const route = resolveModelRoute();
    const patches = [config.patchFile];
    const mcpPatch = prepareMcpPatch();
    if (mcpPatch) patches.push(mcpPatch);
    const llmPatch = prepareLlmPatch();
    if (llmPatch) patches.push(llmPatch);
    harness = new DeepSeekHarness({
      profile: "sdk",
      patches,
      dshHome: config.dshHome,
      processCwd: config.workspace,
      cwd: config.workspace,
      provider: route.provider,
      model: route.model,
      maxTokens: 16_384,
      initializeTimeoutMs: 120_000,
      env: {
        ...childEnv(),
        DEEPSEEK_API_KEY: config.deepseekKey,
        CUSTOM_LLM_API_KEY: config.customLlmKey,
        AGENT_BRIDGE_URL: bridge.url,
        AGENT_BRIDGE_SECRET: bridge.secret,
        AGENT_TOOL_OUTPUT_TOKENS: String(config.toolOutputTokens),
      },
    });
  }
  return harness;
}

async function getSession(record: ConversationRecord): Promise<HarnessSession> {
  const existing = store.getSession(record.dshSessionId);
  if (existing) return existing;

  const instance = getHarness();
  await instance.start();

  const used = record.updatedAt > record.createdAt;
  if (used) {
    try {
      const resumed = await (instance as unknown as {
        resumeSession: (id: string) => Promise<HarnessSession>;
      }).resumeSession(record.dshSessionId);
      store.setSession(record.dshSessionId, resumed);
      log.info("dsh session resumed", { sessionId: record.dshSessionId });
      return resumed;
    } catch (error) {
      log.warn("dsh session resume failed, creating a new handle", {
        sessionId: record.dshSessionId,
        error: errorMessage(error),
      });
    }
  }

  const session = instance.session(record.dshSessionId);
  store.setSession(record.dshSessionId, session);
  return session;
}

export async function runTurn(
  record: ConversationRecord,
  text: string,
  onNotification: (notification: HarnessNotification) => void,
): Promise<RunResult> {
  const session = await getSession(record);
  // 占用期间不允许被 TTL / LRU 释放，避免中途换句柄
  store.markSessionBusy(record.dshSessionId, true);
  try {
    return await session.run(text, { onNotification });
  } finally {
    store.markSessionBusy(record.dshSessionId, false);
  }
}

export async function closeHarness(): Promise<void> {
  if (!harness) return;
  try {
    await harness.close();
  } catch (error) {
    log.warn("harness close failed", { error: errorMessage(error) });
  }
  harness = undefined;
}
