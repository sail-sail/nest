import fs from "node:fs";
import path from "node:path";
import { config } from "./config.ts";
import { log } from "./logger.ts";

export type ModelKind = "deepseek" | "custom";

export interface ModelRoute {
  kind: ModelKind;
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
}

export class ModelConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModelConfigError";
  }
}

/**
 * 模型选择优先级：
 *   1. DEEPSEEK_API_KEY 存在 → 官方 deepseek-official
 *   2. 否则 CUSTOM_LLM_API_KEY + CUSTOM_LLM_BASE_URL + CUSTOM_LLM_MODEL 齐全 → hand-declared gateway
 *   3. 都没有 → 抛错，启动失败
 */
export function resolveModelRoute(): ModelRoute {
  if (config.deepseekKey) {
    return {
      kind: "deepseek",
      provider: "deepseek-official",
      model: config.model,
      baseUrl: config.deepseekBase,
      apiKey: config.deepseekKey,
    };
  }

  if (config.customLlmKey && config.customLlmBase && config.customLlmModel) {
    return {
      kind: "custom",
      provider: config.customLlmProvider,
      model: config.customLlmModel,
      baseUrl: config.customLlmBase,
      apiKey: config.customLlmKey,
    };
  }

  const missing = [
    !config.customLlmKey && "CUSTOM_LLM_API_KEY",
    !config.customLlmBase && "CUSTOM_LLM_BASE_URL",
    !config.customLlmModel && "CUSTOM_LLM_MODEL",
  ].filter(Boolean);

  throw new ModelConfigError(
    `未配置可用模型：请设置 DEEPSEEK_API_KEY，或同时设置 ${missing.join(" / ")}（OpenAI 兼容网关）`,
  );
}

/**
 * 自定义模型需要给 dsh 的 llm-pi-ai 插件加一条 provider route。
 * 生成一个运行时 overlay，启动时叠加到 profile 上；官方 DeepSeek 不需要。
 */
export function prepareLlmPatch(): string | undefined {
  const route = resolveModelRoute();
  if (route.kind !== "custom") return undefined;

  const dir = path.join(config.dshHome, "runtime");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "llm.patch.json");

  const patch = [
    {
      id: "llm-pi-ai",
      config: {
        providers: {
          [route.provider]: {
            displayName: config.customLlmDisplayName || route.provider,
            api: "openai-completions",
            baseURL: route.baseUrl,
            apiKeyEnv: "CUSTOM_LLM_API_KEY",
            models: [
              {
                id: route.model,
                name: config.customLlmDisplayName || route.model,
                contextWindow: config.customLlmContextWindow,
              },
            ],
          },
        },
      },
    },
  ];

  fs.writeFileSync(file, `${JSON.stringify(patch, null, 2)}\n`, "utf8");
  log.info("custom model route prepared", {
    provider: route.provider,
    model: route.model,
    baseURL: route.baseUrl,
  });
  return file;
}
