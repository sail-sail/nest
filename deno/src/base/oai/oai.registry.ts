import {
  z,
} from "zod";

import type {
  OaiMethod,
  OaiRoute,
} from "./oai.types.ts";

type InferParams<T extends z.ZodType | undefined> = T extends z.ZodType
  ? z.infer<T>
  : Record<string, string>;

type InferQuery<T extends z.ZodType | undefined> = T extends z.ZodType
  ? z.infer<T>
  : Record<string, unknown>;

type InferBody<T extends z.ZodType | undefined> = T extends z.ZodType
  ? z.infer<T>
  : unknown;

type InferOutput<T extends z.ZodType | undefined> = T extends z.ZodType
  ? z.infer<T>
  : unknown;

/** 带类型推导的路由声明, handler 的入参和返回值由 schema 推导 */
export interface OaiRouteDef<
  TParams extends z.ZodType | undefined = undefined,
  TQuery extends z.ZodType | undefined = undefined,
  TBody extends z.ZodType | undefined = undefined,
  TOutput extends z.ZodType | undefined = undefined,
> extends Omit<OaiRoute, "params" | "query" | "body" | "output" | "handler"> {

  params?: TParams;

  query?: TQuery;

  body?: TBody;

  output?: TOutput;

  handler: (ctx: {
    params: InferParams<TParams>;
    query: InferQuery<TQuery>;
    body: InferBody<TBody>;
    headers: Headers;
  }) => Promise<InferOutput<TOutput>>;

}

const OAI_METHODS: OaiMethod[] = [ "GET", "POST", "PUT", "PATCH", "DELETE" ];

/**
 * query/body 里的布尔值
 *
 * HTTP query 和 MCP 传参可能是 true/false/1/0 字符串, z.coerce.boolean() 会把 "false" 当成 true
 */
export const oaiBoolean = z.preprocess(function(value) {
  if (value === 1 || value === 0) {
    return value === 1;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }
  return value;
}, z.boolean());

/**
 * 声明一条 openapi 业务接口
 *
 * 声明对象同时用于路由注册、openapi 文档和 MCP 检索, 不需要额外维护注册表
 */
export function defineOaiRoute<
  TParams extends z.ZodType | undefined = undefined,
  TQuery extends z.ZodType | undefined = undefined,
  TBody extends z.ZodType | undefined = undefined,
  TOutput extends z.ZodType | undefined = undefined,
>(
  route: OaiRouteDef<TParams, TQuery, TBody, TOutput>,
): OaiRoute {
  return route as unknown as OaiRoute;
}

/** 校验路由声明, 启动时尽早暴露路径、模块和重复注册问题 */
export function validateOaiRoutes(
  routes: OaiRoute[],
): OaiRoute[] {
  const keys = new Set<string>();
  for (const route of routes) {
    if (!route.module.trim()) {
      throw new Error(`openapi 模块名不能为空: ${ route.method } ${ route.path }`);
    }
    if (!route.summary.trim()) {
      throw new Error(`openapi 接口 summary 不能为空: ${ route.method } ${ route.path }`);
    }
    if (!OAI_METHODS.includes(route.method)) {
      throw new Error(`openapi 接口方法非法: ${ route.method } ${ route.path }`);
    }
    if (!route.path.startsWith("/api/oai/")) {
      throw new Error(`openapi 接口路径必须以 /api/oai/ 开头: ${ route.method } ${ route.path }`);
    }
    if (route.path.includes("?") || route.path.includes("//")) {
      throw new Error(`openapi 接口路径不合法: ${ route.method } ${ route.path }`);
    }
    if (route.path.includes("{")) {
      throw new Error(`路径参数请使用 :name 写法: ${ route.path }`);
    }
    const modulePath = route.path.split("/")[3];
    if (modulePath !== route.module) {
      throw new Error(`openapi 模块名与路径不匹配: module=${ route.module }, path=${ route.path }`);
    }
    const key = `${ route.method } ${ route.path }`;
    if (keys.has(key)) {
      throw new Error(`openapi 接口重复注册: ${ key }`);
    }
    keys.add(key);
  }
  return routes;
}
