import "/lib/env.ts";
import "/lib/util/date_util.ts";
import "/lib/graphql.ts";

import { close } from "/lib/context.ts";
import { getEnv } from "/lib/env.ts";
import { logInit } from "/lib/util/log.ts";
import { closeAllSocketConnections } from "/lib/websocket/websocket.dao.ts";

import { initApp } from "./mod.ts";

type ShutdownSignal = "SIGINT" | "SIGTERM";
type ShutdownReason = ShutdownSignal | "listen completed" | "listen failed";

interface AppConfig {
  hostname: string;
  port: number;
}

const shutdownSignals: ShutdownSignal[] = Deno.build.os === "windows"
  ? [ "SIGINT" ]
  : [ "SIGINT", "SIGTERM" ];

function getNodeEnv() {
  return (globalThis as {
    process?: {
      env?: {
        NODE_ENV?: string;
      };
    };
  }).process?.env?.NODE_ENV;
}

async function initRuntime() {
  if (getNodeEnv() !== "production") {
    return;
  }
  logInit({
    path: await getEnv("log_path"),
    expire_day: parseInt(await getEnv("log_expire_day")),
  });
}

async function loadAppConfig(): Promise<AppConfig> {
  const serverPort = await getEnv("server_port");
  const port = Number(serverPort);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`端口号 server_port: (${ serverPort }) 错误，请检查环境变量！`);
  }
  const hostname = await getEnv("server_host");
  if (!hostname) {
    throw new Error("环境变量 server_host 未配置，请检查环境变量！");
  }
  return {
    hostname,
    port,
  };
}

function registerSignalListeners(controller: AbortController) {
  let shutdownSignal: ShutdownSignal | undefined;
  const disposers: Array<() => void> = [ ];

  for (const signal of shutdownSignals) {
    const listener = () => {
      if (controller.signal.aborted) {
        return;
      }
      shutdownSignal = signal;
      console.log(`${ signal }`);
      console.log(`app stopping: ${ signal }`);
      controller.abort();
    };
    Deno.addSignalListener(signal, listener);
    disposers.push(() => {
      Deno.removeSignalListener(signal, listener);
    });
  }

  return {
    getSignal() {
      return shutdownSignal;
    },
    dispose() {
      for (const dispose of disposers) {
        dispose();
      }
    },
  };
}

async function shutdownApp(reason: ShutdownReason) {
  console.log(`app shutdown cleanup: ${ reason }`);
  closeAllSocketConnections(`server shutdown: ${ reason }`);
  await close();
  console.log("app stopped");
}

export async function bootstrap() {
  await initRuntime();
  const { hostname, port } = await loadAppConfig();
  const app = initApp();
  const controller = new AbortController();
  const signalListeners = registerSignalListeners(controller);

  console.log(`app started: ${ port }`);

  let listenError: unknown;
  let shutdownReason: ShutdownReason = "listen completed";
  try {
    await app.listen({
      port,
      hostname,
      signal: controller.signal,
    });
  } catch (err) {
    shutdownReason = signalListeners.getSignal() || "listen failed";
    if (!controller.signal.aborted) {
      listenError = err;
    }
  } finally {
    if (controller.signal.aborted) {
      shutdownReason = signalListeners.getSignal() || shutdownReason;
    }
    signalListeners.dispose();
    try {
      await shutdownApp(shutdownReason);
    } catch (shutdownError) {
      if (listenError) {
        console.error(shutdownError);
      } else {
        throw shutdownError;
      }
    }
  }

  if (listenError) {
    throw listenError;
  }
}