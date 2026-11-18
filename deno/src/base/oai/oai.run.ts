import type {
  Context as OakContext,
} from "@oak/oak";

import {
  z,
} from "zod";

import {
  commit,
  runInAsyncHooks,
  rollback,
  useMaybeContext,
  newContext,
  type Context,
} from "/lib/context.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import type {
  OaiRoute,
  R,
} from "./oai.types.ts";

const AUTH_ERROR_CODES = new Set([
  "token_empty",
  "refresh_token_expired",
]);

/** 调用 openapi 接口的入参 */
export interface OaiInvokeInput {

  /** HTTP 调用时传入 oak 上下文, MCP 进程内调用可不传 */
  oakCtx?: OakContext;

  /** 直接指定 token, 用于 MCP 进程内调用 */
  authorization?: string;

  /** 路径参数 */
  params: Record<string, string>;

  /** query 参数 */
  query: Record<string, unknown>;

  /** JSON 请求体 */
  body?: unknown;

  /** 请求头 */
  headers?: Headers;

}

/** 成功响应 */
export function ok<T>(
  data: T,
): R<T> {
  return {
    code: 0,
    message: "",
    data: data === undefined ? null : data,
  };
}

/** 失败响应 */
export function fail(
  code: number,
  message: string,
): R {
  return {
    code,
    message,
    data: null,
  };
}

/** 把异常转成统一失败响应, 供 HTTP 分发层复用 */
export function failFromError(
  err: unknown,
): R {
  return fail(toBusinessCode(err), toMessage(err));
}

/**
 * 执行一条 openapi 路由
 *
 * 负责鉴权、事务、统一响应信封; HTTP 和 MCP 共用同一套逻辑
 */
export async function invokeOaiRoute(
  route: OaiRoute,
  input: OaiInvokeInput,
): Promise<R> {
  const activeContext = useMaybeContext();
  if (activeContext) {
    if (input.authorization) {
      activeContext.authorization = input.authorization;
    }
    return await executeRoute(activeContext, route, input);
  }

  const context = newContext(input.oakCtx);
  if (input.authorization) {
    context.authorization = input.authorization;
  }
  const result = await runInAsyncHooks(
    context,
    function() {
      return executeRoute(context, route, input);
    },
  );
  return result ?? fail(500, "请求处理失败");
}

async function executeRoute(
  context: Context,
  route: OaiRoute,
  input: OaiInvokeInput,
): Promise<R> {
  context.is_tran = route.transaction ?? route.method !== "GET";
  let needRollback = false;

  try {
    if (route.auth !== false) {
      const authModel = await getAuthModel();
      if (!authModel) {
        return fail(401, "未登录");
      }
    }

    const params = route.params
      ? route.params.parse(input.params) as Record<string, string>
      : input.params;
    const query = route.query
      ? route.query.parse(input.query) as Record<string, unknown>
      : input.query;
    const body = route.body
      ? route.body.parse(input.body)
      : input.body;

    const data = await route.handler({
      params,
      query,
      body,
      headers: input.headers ?? new Headers(),
    });
    return ok(data);
  } catch (err) {
    needRollback = isNeedRollback(err);
    return failFromError(err);
  } finally {
    if (needRollback) {
      await rollback();
    } else {
      await commit();
    }
  }
}

function isNeedRollback(
  err: unknown,
) {
  if (err instanceof ServiceException) {
    return err._rollback !== false;
  }
  return true;
}

function toBusinessCode(
  err: unknown,
) {
  if (err instanceof z.ZodError) {
    return 400;
  }
  if (!(err instanceof ServiceException)) {
    return 500;
  }
  if (err.code && AUTH_ERROR_CODES.has(err.code)) {
    return 401;
  }
  const code = Number(err.code);
  if (Number.isInteger(code) && code > 0) {
    return code;
  }
  return 400;
}

function toMessage(
  err: unknown,
) {
  if (err instanceof z.ZodError) {
    return err.issues.map(function(issue) {
      const path = issue.path.join(".");
      return path ? `${ path }: ${ issue.message }` : issue.message;
    }).join("; ");
  }
  if (err instanceof ServiceException) {
    if (err.message) {
      return err.message;
    }
    if (err.code === "token_empty") {
      return "未登录";
    }
    if (err.code === "refresh_token_expired") {
      return "登录已过期";
    }
    return err.code || "请求失败";
  }
  if (err instanceof Error) {
    return err.message || "请求失败";
  }
  return String(err || "请求失败");
}
