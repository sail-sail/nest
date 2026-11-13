/**
 * 代码执行沙箱：把一段 Node 代码放进受限子进程里跑。
 *
 * 为什么不用 dsh 自带的 bash/pwsh：
 *   1. dsh 的 Windows ACL 沙箱只挡写、不挡读，子进程能读宿主 .env、
 *      全部租户的 conversations.json 和其他用户的附件暂存，多租户下不可接受；
 *   2. shell 会继承 dsh 进程的环境变量，DEEPSEEK_API_KEY / AGENT_BRIDGE_SECRET 直接可读。
 * Node 的权限模型（--permission）给的是"读白名单 + 写白名单 + 禁子进程 + 禁 addon"，
 * 正好补上这两处，所以自己起进程，不借 shell。
 *
 * 边界（实测 Node 22.22，见 scripts/poc-exec-node.mjs）：
 *   - fs 读写越界、child_process、worker、dlopen、process.binding 全部拒绝；
 *   - 网络放行（产品决定：允许 agent 出网）；
 *   - --max-old-space-size 只压堆，不压 Buffer，所以另有目录容量兜底。
 *
 * 隔离单位是 (usrId, conversationId)：目录名用 usrId 的哈希，避免把用户 id 写进路径；
 * 会话之间互不可见，跨会话残留按 TTL 清理。
 */
import { spawn, type ChildProcess } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fsp from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { config } from "./config.ts";
import { errorMessage, log } from "./logger.ts";

export class SandboxError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "SandboxError";
    this.code = code;
    this.status = status;
  }
}

/** 单流输出上限：超出后只截断，不报错——报错会让模型反复重试同样的代码 */
const OUTPUT_CAP = 16_384;
/** 代码本身的体积上限，防御把整个文件当代码传进来 */
const CODE_CAP = 64 * 1024;
/** 目录体积统计的遍历上限，避免超大目录把宿主卡住 */
const STAT_ENTRY_CAP = 5_000;

export interface SandboxRunInput {
  usrId: string;
  conversationId: string;
  code: string;
  timeoutMs?: number;
}

export interface SandboxRunResult {
  ok: boolean;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
  stdout: string;
  stderr: string;
  /** 输出被裁剪过，提示模型缩小打印范围 */
  truncated: boolean;
  /** 会话目录里的文件列表（只列一层），让模型知道上一轮的产物还在不在 */
  files: string[];
}

/**
 * 目录键必须由宿主推导，不能接受模型传参。
 * 否则模型换一个 conversationId 就能读别人的目录，隔离形同虚设。
 */
export function sandboxDir(usrId: string, conversationId: string): string {
  const user = createHash("sha256").update(usrId).digest("hex").slice(0, 16);
  const conversation = conversationId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64) || "default";
  return path.join(config.sandboxRoot, user, conversation);
}

/**
 * 环境变量白名单。默认继承会把宿主的 API key 直接交给模型生成的代码，
 * 而代码会把日志、报错、console.log 带进上下文——等于把密钥写进对话。
 */
function sandboxEnv(dir: string): NodeJS.ProcessEnv {
  const tmp = path.join(dir, ".tmp");
  return {
    PATH: process.env.PATH ?? "",
    SystemRoot: process.env.SystemRoot ?? "C:\\Windows",
    SystemDrive: process.env.SystemDrive ?? "C:",
    windir: process.env.windir ?? "C:\\Windows",
    COMSPEC: process.env.COMSPEC ?? "C:\\Windows\\System32\\cmd.exe",
    PATHEXT: process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD",
    NUMBER_OF_PROCESSORS: process.env.NUMBER_OF_PROCESSORS ?? "1",
    // 指到授权目录内：TMP 落在别处会因为无写权限而报奇怪的错
    TEMP: tmp,
    TMP: tmp,
    TMPDIR: tmp,
    NODE_ENV: "sandbox",
  };
}

async function dirBytes(dir: string, cap: number): Promise<number> {
  let total = 0;
  let seen = 0;

  const walk = async (current: string): Promise<void> => {
    let entries: Dirent[];
    try {
      entries = await fsp.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (total > cap || seen > STAT_ENTRY_CAP) return;
      seen += 1;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        try {
          total += (await fsp.stat(full)).size;
        } catch {
          // 并发删除，忽略
        }
      }
    }
  };

  await walk(dir);
  return total;
}

/**
 * 报错里会出现入口文件的绝对路径（file:///D:/.../.dsh/sandbox/<hash>/<conv>/run-xxx.mjs）。
 * 这等于把宿主目录结构和用户的桶哈希交给模型，没必要，替换成稳定的相对名。
 */
function sanitizeOutput(text: string, dir: string, entry: string): string {
  if (!text) return text;
  const variants = (value: string) => [value, value.replaceAll("\\", "/"), pathToFileURL(value).href];
  let out = text;
  // 入口在目录内，必须先换更长的那个
  for (const variant of variants(entry)) {
    out = out.split(variant).join(variant.startsWith("file:") ? "file://./main.mjs" : "./main.mjs");
  }
  for (const variant of variants(dir)) {
    out = out.split(variant).join(variant.startsWith("file:") ? "file://." : ".");
  }
  return out;
}

/** 超时后必须回收整棵进程树；Windows 上 child.kill 只杀直接子进程 */function killTree(child: ChildProcess): void {
  const pid = child.pid;
  if (!pid) return;
  if (process.platform === "win32") {
    try {
      spawn("taskkill", ["/pid", String(pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      }).on("error", () => child.kill("SIGKILL"));
    } catch {
      child.kill("SIGKILL");
    }
    return;
  }
  try {
    process.kill(-pid, "SIGKILL");
  } catch {
    child.kill("SIGKILL");
  }
}

async function run(input: SandboxRunInput): Promise<SandboxRunResult> {
  // 开关收在模块边界上，避免以后有人绕过 bridge 直接调用
  if (!config.sandboxEnabled) {
    throw new SandboxError("代码执行已关闭（AGENT_SANDBOX=false）", "SANDBOX_DISABLED", 403);
  }

  const code = input.code ?? "";
  if (!code.trim()) throw new SandboxError("code 不能为空", "BAD_REQUEST", 400);
  if (Buffer.byteLength(code, "utf8") > CODE_CAP) {
    throw new SandboxError(
      `代码超过 ${CODE_CAP} 字节上限，请拆成多次调用，或把数据写进文件再读`,
      "CODE_TOO_LARGE",
      413,
    );
  }

  const dir = sandboxDir(input.usrId, input.conversationId);
  await fsp.mkdir(path.join(dir, ".tmp"), { recursive: true });

  const used = await dirBytes(dir, config.sandboxMaxDirBytes);
  if (used > config.sandboxMaxDirBytes) {
    throw new SandboxError(
      `会话目录已占用 ${Math.round(used / 1024 / 1024)}MB，超过 ${Math.round(
        config.sandboxMaxDirBytes / 1024 / 1024,
      )}MB 上限。请先删除不再需要的中间文件`,
      "SANDBOX_DISK_FULL",
      413,
    );
  }

  const entry = path.join(dir, `run-${randomBytes(4).toString("hex")}.mjs`);
  await fsp.writeFile(entry, code, "utf8");

  const timeoutMs = Math.min(
    Math.max(Math.floor(input.timeoutMs ?? config.sandboxTimeoutMs), 1_000),
    config.sandboxTimeoutMaxMs,
  );

  const args = [
    "--permission",
    `--allow-fs-read=${dir}`,
    ...config.sandboxReadDirs.map((extra) => `--allow-fs-read=${extra}`),
    `--allow-fs-write=${dir}`,
    `--max-old-space-size=${config.sandboxMaxHeapMb}`,
    entry,
  ];

  const started = Date.now();
  const child = spawn(process.execPath, args, {
    cwd: dir,
    env: sandboxEnv(dir),
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    // 非 Windows 用独立进程组，便于整组回收
    detached: process.platform !== "win32",
  });

  let stdout = "";
  let stderr = "";
  let truncated = false;

  const collect = (target: "out" | "err", chunk: Buffer): void => {
    const text = chunk.toString("utf8");
    const current = target === "out" ? stdout : stderr;
    if (current.length >= OUTPUT_CAP) {
      truncated = true;
      return;
    }
    const next = current + text.slice(0, OUTPUT_CAP - current.length);
    if (next.length < current.length + text.length) truncated = true;
    if (target === "out") stdout = next;
    else stderr = next;
  };

  child.stdout?.on("data", (chunk: Buffer) => collect("out", chunk));
  child.stderr?.on("data", (chunk: Buffer) => collect("err", chunk));

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    killTree(child);
  }, timeoutMs);

  const exit = await new Promise<{ code: number | null; error?: Error }>((resolve) => {
    child.once("close", (exitCode) => resolve({ code: exitCode }));
    child.once("error", (error) => resolve({ code: null, error }));
  });
  clearTimeout(timer);

  await fsp.rm(entry, { force: true });

  let files: string[] = [];
  try {
    files = (await fsp.readdir(dir, { withFileTypes: true }))
      .filter((item) => item.isFile() && !item.name.startsWith("run-"))
      .map((item) => item.name)
      .slice(0, 50);
  } catch {
    // 目录被外部清掉，忽略
  }

  const durationMs = Date.now() - started;
  log.info("sandbox run", {
    usr: createHash("sha256").update(input.usrId).digest("hex").slice(0, 8),
    conversation: input.conversationId,
    codeBytes: Buffer.byteLength(code, "utf8"),
    exitCode: exit.code,
    timedOut,
    durationMs,
  });

  if (exit.error) {
    throw new SandboxError(`沙箱进程启动失败：${errorMessage(exit.error)}`, "SANDBOX_SPAWN_FAILED", 500);
  }

  return {
    ok: !timedOut && exit.code === 0,
    exitCode: exit.code,
    timedOut,
    durationMs,
    stdout: sanitizeOutput(stdout.trim(), dir, entry),
    stderr: sanitizeOutput(stderr.trim(), dir, entry),
    truncated,
    files,
  };
}

/** 清掉超过保留期的会话目录；每次执行前节流触发，失败只记日志 */
let lastSweep = 0;

async function sweep(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastSweep < 60 * 60_000) return;
  lastSweep = now;

  let users: string[] = [];
  try {
    users = await fsp.readdir(config.sandboxRoot);
  } catch {
    return;
  }

  for (const user of users) {
    const userDir = path.join(config.sandboxRoot, user);
    let conversations: string[] = [];
    try {
      conversations = await fsp.readdir(userDir);
    } catch {
      continue;
    }
    for (const conversation of conversations) {
      const dir = path.join(userDir, conversation);
      try {
        const stat = await fsp.stat(dir);
        if (now - stat.mtimeMs > config.sandboxRetentionMs) {
          await fsp.rm(dir, { recursive: true, force: true });
        }
      } catch {
        // 已删除，忽略
      }
    }
    try {
      const rest = await fsp.readdir(userDir);
      if (rest.length === 0) await fsp.rmdir(userDir);
    } catch {
      // 非空或被占用，忽略
    }
  }
}

export const sandbox = {
  async init(): Promise<void> {
    if (!config.sandboxEnabled) return;
    await fsp.mkdir(config.sandboxRoot, { recursive: true });
    await sweep(true);
    log.info("sandbox ready", {
      root: config.sandboxRoot,
      timeoutMs: config.sandboxTimeoutMs,
      maxHeapMb: config.sandboxMaxHeapMb,
    });
  },

  /** 执行一段代码；调用方负责先确认会话已绑定用户 */
  async run(input: SandboxRunInput): Promise<SandboxRunResult> {
    void sweep();
    return run(input);
  },

  sweep,
};
