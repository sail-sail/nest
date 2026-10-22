import { randomUUID } from "node:crypto";
import { config } from "./config.ts";
import { log } from "./logger.ts";

/**
 * 页面操作任务的最终结果。由浏览器里的 PageAgent 执行完后回传。
 */
export interface PageTaskResult {
  success: boolean;
  data: string;
  steps?: number;
  path?: string;
}

export interface PageTaskInput {
  instruction: string;
  maxSteps?: number;
}

export class PageOfflineError extends Error {
  constructor(message = "用户当前没有打开可操作的页面（前端未连接）") {
    super(message);
    this.name = "PageOfflineError";
  }
}

export class PageBusyError extends Error {
  constructor(message = "页面正在执行上一个操作，请稍后再试") {
    super(message);
    this.name = "PageBusyError";
  }
}

type Send = (event: string, data: unknown) => void;

interface Channel {
  id: string;
  usrId: string;
  attachedAt: number;
  lastSeen: number;
  visible: boolean;
  focused: boolean;
  path: string;
  send: Send;
}

interface PendingTask {
  usrId: string;
  channelId: string;
  resolve: (result: PageTaskResult) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 浏览器页面操作通道的注册表。
 *
 * 浏览器通过 SSE 连到宿主，宿主把 dsh 的工具调用转成一条 task 帧下发；
 * 浏览器执行完再 POST 回结果。token 只在浏览器和宿主之间流转，不进 dsh。
 */
class PageHub {
  private readonly channels = new Map<string, Channel>();
  private readonly pending = new Map<string, PendingTask>();

  attach(usrId: string, send: Send): Channel {
    const channel: Channel = {
      id: randomUUID(),
      usrId,
      attachedAt: Date.now(),
      lastSeen: Date.now(),
      visible: true,
      focused: false,
      path: "",
      send,
    };
    this.channels.set(channel.id, channel);
    log.info("page channel attached", {
      usrId,
      channels: this.channelsFor(usrId).length,
    });
    return channel;
  }

  detach(channel: Channel): void {
    if (!this.channels.delete(channel.id)) return;

    for (const [taskId, task] of this.pending) {
      if (task.channelId !== channel.id) continue;
      clearTimeout(task.timer);
      this.pending.delete(taskId);
      task.reject(new PageOfflineError("页面连接已断开，操作被取消"));
    }

    log.info("page channel detached", {
      usrId: channel.usrId,
      channels: this.channelsFor(channel.usrId).length,
    });
  }

  /**
   * 多标签页时优先选「有焦点 → 可见 → 最近心跳」的那个，
   * 避免把确认框弹在后台标签页里。
   */
  private channelsFor(usrId: string): Channel[] {
    return [...this.channels.values()]
      .filter((channel) => channel.usrId === usrId)
      .sort(
        (a, b) =>
          Number(b.focused) - Number(a.focused) ||
          Number(b.visible) - Number(a.visible) ||
          b.lastSeen - a.lastSeen,
      );
  }

  isOnline(usrId: string): boolean {
    return this.channelsFor(usrId).length > 0;
  }

  status(usrId: string): { online: boolean; path: string; tabs: number } {
    const list = this.channelsFor(usrId);
    return {
      online: list.length > 0,
      path: list[0]?.path ?? "",
      tabs: list.length,
    };
  }

  /**
   * 心跳：记录该标签页最近活跃时间、路由、可见性与焦点。
   * 必须同时校验 usrId 与 channelId：空 channelId 不再兜底到任意 channel，
   * 否则可能把别的用户的连接状态（path/focused/lastSeen）改掉。
   */
  touch(usrId: string, channelId: string, path: string, visible?: boolean, focused?: boolean): void {
    if (!channelId) return;
    const channel = this.channels.get(channelId);
    if (!channel || channel.usrId !== usrId) return;
    channel.lastSeen = Date.now();
    if (path) channel.path = path;
    if (typeof visible === "boolean") channel.visible = visible;
    if (typeof focused === "boolean") channel.focused = focused;
  }

  async runTask(usrId: string, input: PageTaskInput): Promise<PageTaskResult> {
    const channel = this.channelsFor(usrId)[0];
    if (!channel) throw new PageOfflineError();

    const busy = [...this.pending.values()].some((task) => task.usrId === usrId);
    if (busy) throw new PageBusyError();

    const taskId = `pt_${randomUUID().replaceAll("-", "")}`;
    const maxSteps = clamp(input.maxSteps ?? config.pageMaxSteps, 1, 40);

    return new Promise<PageTaskResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(taskId);
        // 通知浏览器停下，避免服务端已经放弃而页面还在点
        channel.send("cancel", { id: taskId });
        reject(new Error(`页面操作超时（${Math.round(config.pageTimeoutMs / 1000)} 秒）`));
      }, config.pageTimeoutMs);

      this.pending.set(taskId, {
        usrId,
        channelId: channel.id,
        resolve,
        reject,
        timer,
      });

      try {
        channel.send("task", {
          id: taskId,
          instruction: input.instruction,
          maxSteps,
          timeoutMs: config.pageTimeoutMs,
        });
        log.info("page task dispatched", {
          usrId,
          taskId,
          channelId: channel.id,
          maxSteps,
        });
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(taskId);
        reject(error as Error);
      }
    });
  }

  complete(usrId: string, taskId: string, result: PageTaskResult): boolean {
    const task = this.pending.get(taskId);
    if (!task || task.usrId !== usrId) return false;

    clearTimeout(task.timer);
    this.pending.delete(taskId);
    task.resolve(result);

    const channel = this.channels.get(task.channelId);
    if (channel) {
      channel.lastSeen = Date.now();
      if (result.path) channel.path = result.path;
    }
    return true;
  }
}

export const pageHub = new PageHub();
