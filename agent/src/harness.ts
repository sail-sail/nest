import { DeepSeekHarness, type HarnessNotification, type HarnessSession, type RunResult } from "@deepseek-ai/dsh-sdk-client";
import { config } from "./config.ts";
import type { BridgeHandle } from "./bridge.ts";
import { errorMessage, log } from "./logger.ts";
import { prepareMcpPatch } from "./mcp-config.ts";
import { store, type ConversationRecord } from "./store.ts";

let harness: DeepSeekHarness | undefined;
let bridge: BridgeHandle | undefined;

export function initHarness(bridgeHandle: BridgeHandle): void {
  bridge = bridgeHandle;
}

function getHarness(): DeepSeekHarness {
  if (!harness) {
    if (!bridge) throw new Error("bridge 尚未启动");
    if (!config.deepseekKey) {
      log.warn("DEEPSEEK_API_KEY 为空，模型调用会失败");
    }
    const patches = [config.patchFile];
    const mcpPatch = prepareMcpPatch();
    if (mcpPatch) patches.push(mcpPatch);
    harness = new DeepSeekHarness({
      profile: "sdk",
      patches,
      dshHome: config.dshHome,
      processCwd: config.workspace,
      cwd: config.workspace,
      provider: "deepseek-official",
      model: config.model,
      maxTokens: 16_384,
      initializeTimeoutMs: 120_000,
      env: {
        ...process.env,
        DEEPSEEK_API_KEY: config.deepseekKey,
        AGENT_BRIDGE_URL: bridge.url,
        AGENT_BRIDGE_SECRET: bridge.secret,
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
  return session.run(text, { onNotification });
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
